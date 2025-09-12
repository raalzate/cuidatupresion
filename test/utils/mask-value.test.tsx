import { maskValue } from "../../utils/mask-value";

describe("maskValue", () => {
  describe("Basic Functionality", () => {
    it("should mask a normal string correctly", () => {
      const result = maskValue("hello");
      expect(result).toBe("h***o");
    });

    it("should mask a longer string correctly", () => {
      const result = maskValue("javascript");
      expect(result).toBe("j********t");
    });

    it("should preserve first and last characters", () => {
      const result = maskValue("testing");
      expect(result).toBe("t*****g");
    });

    it("should handle 3-character strings", () => {
      const result = maskValue("abc");
      expect(result).toBe("a*c");
    });

    it("should handle 4-character strings", () => {
      const result = maskValue("test");
      expect(result).toBe("t**t");
    });
  });

  describe("Edge Cases", () => {
    it("should return empty string as is", () => {
      const result = maskValue("");
      expect(result).toBe("");
    });

    it("should return single character as is", () => {
      const result = maskValue("a");
      expect(result).toBe("a");
    });

    it("should return two characters as is", () => {
      const result = maskValue("ab");
      expect(result).toBe("ab");
    });

    it("should handle string with only spaces", () => {
      const result = maskValue("   ");
      expect(result).toBe(" * ");
    });

    it("should handle string with special characters", () => {
      const result = maskValue("a@b#c");
      expect(result).toBe("a***c");
    });

    it("should handle string with numbers", () => {
      const result = maskValue("12345");
      expect(result).toBe("1***5");
    });

    it("should handle mixed alphanumeric string", () => {
      const result = maskValue("a1b2c3");
      expect(result).toBe("a****3");
    });
  });

  describe("Length Validation", () => {
    it("should return correct number of asterisks for various lengths", () => {
      expect(maskValue("abc")).toBe("a*c");
      expect(maskValue("abcd")).toBe("a**d");
      expect(maskValue("abcde")).toBe("a***e");
      expect(maskValue("abcdef")).toBe("a****f");
    });

    it("should calculate asterisks length correctly", () => {
      const input = "verylongstring";
      const result = maskValue(input);
      const expectedAsterisks = input.length - 2;

      expect(result.length).toBe(input.length);
      expect(result.split("*").length - 1).toBe(expectedAsterisks);
    });

    it("should maintain original string length", () => {
      const inputs = ["abc", "test", "hello world", "a".repeat(20)];

      inputs.forEach((input) => {
        if (input.length > 2) {
          const result = maskValue(input);
          expect(result.length).toBe(input.length);
        }
      });
    });
  });

  describe("Character Types", () => {
    it("should handle uppercase letters", () => {
      const result = maskValue("HELLO");
      expect(result).toBe("H***O");
    });

    it("should handle mixed case", () => {
      const result = maskValue("HeLLo");
      expect(result).toBe("H***o");
    });

    it("should handle unicode characters", () => {
      const result = maskValue("héllo");
      expect(result).toBe("h***o");
    });

    it("should handle emoji characters", () => {
      const input = "a🚀b";
      const result = maskValue(input);

      expect(result.length).toBe(input.length);
      expect(typeof result).toBe("string");

      if (input.length > 2) {
        const middle = result.slice(1, -1);
        expect(middle).toMatch(/\*/);
      }
    });

    it("should handle accented characters", () => {
      const result = maskValue("café");
      expect(result).toBe("c**é");
    });

    it("should handle symbols", () => {
      const result = maskValue("!@#$%");
      expect(result).toBe("!***%");
    });
  });

  describe("Real-world Scenarios", () => {
    it("should mask email addresses correctly", () => {
      const result = maskValue("user@example.com");

      expect(result).toBe("u**************m");
      expect(result.charAt(0)).toBe("u");
      expect(result.charAt(result.length - 1)).toBe("m");
    });

    it("should mask phone numbers correctly", () => {
      const result = maskValue("1234567890");
      expect(result).toBe("1********0");
    });

    it("should mask credit card numbers correctly", () => {
      const result = maskValue("1234567890123456");
      expect(result).toBe("1**************6");
    });

    it("should mask passwords correctly", () => {
      const result = maskValue("MySecretPassword123");
      expect(result).toBe("M*****************3");
    });

    it("should mask user IDs correctly", () => {
      const result = maskValue("USER12345");
      expect(result).toBe("U*******5");
    });

    it("should mask API keys correctly", () => {
      const result = maskValue("sk-1234567890abcdef");
      expect(result).toBe("s*****************f");
    });
  });

  describe("Performance and Edge Boundaries", () => {
    it("should handle very long strings efficiently", () => {
      const longString = "a".repeat(1000) + "b";
      const result = maskValue(longString);

      expect(result.charAt(0)).toBe("a");
      expect(result.charAt(result.length - 1)).toBe("b");
      expect(result.length).toBe(1001);
      expect(result.split("*").length - 1).toBe(999);
    });

    it("should handle minimum maskable length", () => {
      const result = maskValue("xyz");
      expect(result).toBe("x*z");
    });

    it("should be consistent with multiple calls", () => {
      const input = "consistent";
      const result1 = maskValue(input);
      const result2 = maskValue(input);

      expect(result1).toBe(result2);
      expect(result1).toBe("c********t");
    });
  });

  describe("Input Validation", () => {
    it("should handle whitespace strings", () => {
      expect(maskValue(" ")).toBe(" ");
      expect(maskValue("  ")).toBe("  ");
      expect(maskValue("   ")).toBe(" * ");
      expect(maskValue("    ")).toBe(" ** ");
    });

    it("should handle strings with only special characters", () => {
      expect(maskValue("!@#")).toBe("!*#");
      expect(maskValue("***")).toBe("***");
      expect(maskValue("...")).toBe(".*.");
    });

    it("should handle strings with leading/trailing spaces", () => {
      const result = maskValue(" test ");
      expect(result).toBe(" **** ");
    });

    it("should handle newline characters", () => {
      const result = maskValue("a\nb\nc");
      expect(result).toBe("a***c");
    });

    it("should handle tab characters", () => {
      const result = maskValue("a\tb\tc");
      expect(result).toBe("a***c");
    });
  });

  describe("Return Type Validation", () => {
    it("should always return a string", () => {
      const inputs = ["", "a", "ab", "abc", "test", "longer string"];

      inputs.forEach((input) => {
        const result = maskValue(input);
        expect(typeof result).toBe("string");
      });
    });

    it("should never return undefined or null", () => {
      const inputs = ["", "a", "ab", "abc"];

      inputs.forEach((input) => {
        const result = maskValue(input);
        expect(result).not.toBeUndefined();
        expect(result).not.toBeNull();
      });
    });

    it("should preserve string immutability", () => {
      const original = "immutable";
      const result = maskValue(original);

      expect(original).toBe("immutable");
      expect(result).toBe("i*******e");
      expect(result).not.toBe(original);
    });
  });

  describe("Pattern Validation", () => {
    it("should always have asterisks in the middle for strings > 2 chars", () => {
      const inputs = ["abc", "test", "hello", "javascript"];

      inputs.forEach((input) => {
        const result = maskValue(input);
        const middle = result.slice(1, -1);
        expect(middle).toMatch(/^\*+$/);
      });
    });

    it("should never mask first or last character for strings > 2 chars", () => {
      const inputs = ["abc", "test", "hello world", "specialChars!@#"];

      inputs.forEach((input) => {
        const result = maskValue(input);
        if (input.length > 2) {
          expect(result.charAt(0)).toBe(input.charAt(0));
          expect(result.charAt(result.length - 1)).toBe(
            input.charAt(input.length - 1)
          );
        }
      });
    });

    it("should have correct pattern structure", () => {
      const result = maskValue("pattern");
      expect(result).toMatch(/^p\*+n$/);
      expect(result.charAt(0)).not.toBe("*");
      expect(result.charAt(result.length - 1)).not.toBe("*");
    });
  });
});
