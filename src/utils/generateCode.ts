export function generateShortCode(codes: string[]) {
  const length = 8; // Desired length of the code
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"; // Set of characters to use
  let code = ""; // Initialize the code variable

  do {
    code = ""; // Initialize the code variable
    for (let i = 0; i < length; i++) {
      // Loop through the desired length of the code
      const randIndex = Math.floor(Math.random() * chars.length); // Generate a random index for the character set
      code += chars[randIndex]; // Add the random character to the code
    }
    code = code.slice(0, 4) + "-" + code.slice(4, 8); // Add a dash in the middle of the code
  } while (codes.includes(code));

  return code; // Return the generated code
}
