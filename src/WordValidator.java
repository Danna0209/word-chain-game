import java.util.HashSet;

public class WordValidator {
    private HashSet<String> usedWords;
    private char lastChar;

    public WordValidator() {
        usedWords = new HashSet<>();
        lastChar = '\0'; 
    }

    public boolean isMoveValid(String word) {
        if (word == null || word.isEmpty()) {
            return false;
        }
        word = word.toLowerCase();

        // Check if word has been used
        if (usedWords.contains(word)) {
            return false;
        }

        // Check if it matches the last letter
        if (lastChar != '\0' && word.charAt(0) != lastChar) {
            return false;
        }

        return true;
    }

    public void addWord(String word) {
        word = word.toLowerCase();
        usedWords.add(word);
        lastChar = word.charAt(word.length() - 1);
    }
}