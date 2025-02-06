using expression_parser.Laxers;
using expression_parser.Parsers;

public class Calculator
{
    public static (bool Success, double Result, string Error) Calculate(string expression)
    {
        try
        {
            Lexer lexer = new Lexer(expression);
            Parser parser = new Parser(lexer);
            double result = parser.Expr();
            return (true, result, null);
        }
        catch (Exception ex)
        {
            return (false, 0, ex.Message);
        }
    }
}

class Program
{
    static void Main(string[] args)
    {
        Console.WriteLine("Simple Calculator");
        Console.WriteLine("Enter an expression to calculate or type 'exit' to quit.");

        while (true)
        {
            Console.Write("> ");
            string input = Console.ReadLine()!;

            if (string.IsNullOrWhiteSpace(input) || string.IsNullOrEmpty(input))
                continue;

            if (input.ToLower() == "exit")
                break;

            var (success, result, error) = Calculator.Calculate(input);

            if (success)
            {
                Console.WriteLine($"Result: {result}");
            }
            else
            {
                Console.WriteLine($"Error: {error}");
            }
        }

        Console.WriteLine("Calculator exited.");
    }
}