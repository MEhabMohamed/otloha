export default function showPass(p: string): string | undefined {
  const element = document.querySelector(`#${p}`) as HTMLInputElement | null;
  if (element) {
    if (element.type === 'password') {
      element.type = 'text';
      return 'text';
    } else {
      element.type = 'password';
      return 'password';
    }
  }
}
