import crypto from 'crypto'

// Configurações de criptografia
const ALGORITHM = 'aes-256-gcm'
const KEY_LENGTH = 32 // 256 bits
const IV_LENGTH = 16 // 128 bits

/**
 * Gera uma chave de criptografia a partir da secret key do ambiente
 * Usa PBKDF2 para derivar uma chave forte
 */
function getEncryptionKey(): Buffer {
  const secret = process.env.ENCRYPTION_SECRET_KEY

  if (!secret) {
    throw new Error('ENCRYPTION_SECRET_KEY não está definida no ambiente')
  }

  // Deriva uma chave de 32 bytes a partir do secret
  // Usa um salt fixo (em produção, considere usar salt por empresa)
  const salt = 'control-ai-encryption-salt-v1'

  return crypto.pbkdf2Sync(secret, salt, 100000, KEY_LENGTH, 'sha256')
}

/**
 * Criptografa um texto usando AES-256-GCM
 * Retorna uma string no formato: iv:authTag:encryptedData (tudo em hex)
 */
export function encrypt(plaintext: string): string {
  try {
    const key = getEncryptionKey()
    const iv = crypto.randomBytes(IV_LENGTH)

    const cipher = crypto.createCipheriv(ALGORITHM, key, iv)

    let encrypted = cipher.update(plaintext, 'utf8', 'hex')
    encrypted += cipher.final('hex')

    const authTag = cipher.getAuthTag()

    // Retorna iv:authTag:encrypted (todos em hex)
    return `${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted}`
  } catch (error) {
    console.error('Erro ao criptografar:', error)
    throw new Error('Falha na criptografia')
  }
}

/**
 * Descriptografa um texto criptografado
 * Espera string no formato: iv:authTag:encryptedData (tudo em hex)
 */
export function decrypt(encryptedText: string): string {
  try {
    const key = getEncryptionKey()

    // Separa os componentes
    const parts = encryptedText.split(':')
    if (parts.length !== 3) {
      throw new Error('Formato de dados criptografados inválido')
    }

    const iv = Buffer.from(parts[0], 'hex')
    const authTag = Buffer.from(parts[1], 'hex')
    const encrypted = parts[2]

    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv)
    decipher.setAuthTag(authTag)

    let decrypted = decipher.update(encrypted, 'hex', 'utf8')
    decrypted += decipher.final('utf8')

    return decrypted
  } catch (error) {
    console.error('Erro ao descriptografar:', error)
    throw new Error('Falha na descriptografia')
  }
}

/**
 * Verifica se uma string está no formato criptografado esperado
 */
export function isEncrypted(text: string): boolean {
  if (!text) return false

  const parts = text.split(':')
  if (parts.length !== 3) return false

  // Verifica se parece com hex válido
  const hexPattern = /^[0-9a-f]+$/i
  return parts.every((part) => hexPattern.test(part))
}

/**
 * Mascara uma string para exibição (mostra apenas primeiros e últimos caracteres)
 */
export function maskString(text: string, visibleChars: number = 4): string {
  if (!text || text.length <= visibleChars * 2) {
    return '****'
  }

  const start = text.substring(0, visibleChars)
  const end = text.substring(text.length - visibleChars)

  return `${start}${'*'.repeat(text.length - visibleChars * 2)}${end}`
}
