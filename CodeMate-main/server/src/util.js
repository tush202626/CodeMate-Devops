function convertToCodeFormat(inputCode) {
    // Escape special characters for JSON compatibility
    const formattedCode = inputCode
        .replace(/\\/g, '\\\\') // Escape backslashes
        .replace(/"/g, '\\"')   // Escape double quotes
        .replace(/\n/g, '\\n'); // Replace newlines with \n

    return `"${formattedCode}"`; // Wrap in quotes as per the required format
}

// Example usage:
// const userInputCode = `#include <iostream>
//   using namespace std;
//   int main() {
//     cout << "Hello, World!";
//     return 0;
//   }`;

// console.log(convertToCodeFormat(userInputCode));
module.exports = {
    convertToCodeFormat,
}