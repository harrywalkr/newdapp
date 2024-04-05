export const minifyContract = (contract: string) => {
  if (!contract) return "";
  if (contract.length <= 12) return contract;
  const first = contract.slice(0, 6);
  const second = contract.slice(-6, contract.length);
  return `${first}...${second}`;
};

export const minifyTokenName = (tokenName: string | undefined) => {
  if (!tokenName) return "";
  // return tokenName;
  if (tokenName.length <= 12) return tokenName;
  const first = tokenName.slice(0, 12);
  return `${first}...`;
};

export function truncate(text: string, length?: number): string {
  var maxLength = length || 20;
  var result = `${text.substring(0, maxLength)}  ${
    text.length > maxLength ? "..." : ""
  }`;
  return result;
}
