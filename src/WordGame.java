import java.util.Scanner;

public class WordGame {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        WordValidator game = new WordValidator();
        
        System.out.println("Welcome to the Word Chain Game!");
        System.out.println("Enter a word to start:");

        while (true) {
            String input = scanner.nextLine().trim();

            if (game.isMoveValid(input)) {
                game.addWord(input);
                System.out.println("Valid! Next word must start with: " 
                                   + input.charAt(input.length() - 1));
            } else {
                System.out.println("Game Over! That word is invalid or already used.");
                break;
            }
        }
        
        scanner.close();
    }
}