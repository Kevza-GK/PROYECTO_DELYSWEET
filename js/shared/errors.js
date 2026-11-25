export class AppError extends Error {
  constructor(mensaje, codigo = 'APP_ERROR') {
    super(mensaje);
    this.name = 'AppError';
    this.codigo = codigo;
  }
}
