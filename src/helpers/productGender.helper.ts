export type ProductGender = 
  | 'MASCULINO'
  | 'FEMININO'
  | 'INFANTIL'
  | 'JUVENIL'
  | 'UNISSEX'
  | 'FAT'
  | 'OUTRO';

const genderMap: Record<ProductGender, string> = {
  MASCULINO: 'Masculino',
  FEMININO: 'Feminino',
  INFANTIL: 'Infantil',
  JUVENIL: 'Juvenil',
  UNISSEX: 'Unissex',
  FAT: 'Plus Size',
  OUTRO: 'Outro',
};

export function translateGender(gender: string): string {
  return genderMap[gender as ProductGender] || gender;
}
