using expression_parser.Laxers;
using expression_parser.Tokens;

namespace expression_parser.Parsers;

public class Parser
{
    private readonly Lexer _lexer;
    private Token _currentToken;

    public Parser(Lexer lexer)
    {
        _lexer = lexer;
        _currentToken = _lexer.GetNextToken();
    }

    private void Eat(TokenType tokenType)
    {
        if (_currentToken.Type == tokenType)
        {
            _currentToken = _lexer.GetNextToken();
        }
        else
        {
            throw new Exception($"Expected {tokenType}, but found {_currentToken.Type}");
        }
    }

    private double Factor()
    {
        Token token = _currentToken;

        if (token.Type == TokenType.Number)
        {
            Eat(TokenType.Number);
            return double.Parse(token.Value);
        }
        else if (token.Type == TokenType.LeftParenthesis)
        {
            Eat(TokenType.LeftParenthesis);
            double result = Expr(); // 递归解析括号内的表达式
            Eat(TokenType.RightParenthesis);
            return result;
        }

        throw new Exception("Invalid syntax in Factor");
    }

    private double Term()
    {
        double result = Factor();

        while (_currentToken.Type == TokenType.Multiply || _currentToken.Type == TokenType.Divide)
        {
            Token token = _currentToken;

            if (token.Type == TokenType.Multiply)
            {
                Eat(TokenType.Multiply);
                result *= Factor();
            }
            else if (token.Type == TokenType.Divide)
            {
                Eat(TokenType.Divide);
                result /= Factor();
            }
        }

        return result;
    }

    public double Expr()
    {
        double result = Term();

        while (_currentToken.Type == TokenType.Plus || _currentToken.Type == TokenType.Minus)
        {
            Token token = _currentToken;

            if (token.Type == TokenType.Plus)
            {
                Eat(TokenType.Plus);
                result += Term();
            }
            else if (token.Type == TokenType.Minus)
            {
                Eat(TokenType.Minus);
                result -= Term();
            }
        }

        return result;
    }
}
