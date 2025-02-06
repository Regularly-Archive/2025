using expression_parser.Tokens;

namespace expression_parser.Laxers;

public class Lexer
{
    private readonly string _text;
    private int _pos = 0;
    private char _currentChar;

    public Lexer(string text)
    {
        _text = text;
        _currentChar = _text[_pos];
    }

    private void Advance()
    {
        _pos++;
        _currentChar = _pos < _text.Length ? _text[_pos] : '\0';
    }

    private void SkipWhitespace()
    {
        while (_currentChar != '\0' && char.IsWhiteSpace(_currentChar))
        {
            Advance();
        }
    }

    private string ReadNumber()
    {
        string result = "";
        while (_currentChar != '\0' && char.IsDigit(_currentChar))
        {
            result += _currentChar;
            Advance();
        }
        return result;
    }

    public Token GetNextToken()
    {
        while (_currentChar != '\0')
        {
            // 跳过空格
            if (char.IsWhiteSpace(_currentChar))
            {
                SkipWhitespace();
                continue;
            }

            // 解析数字
            if (char.IsDigit(_currentChar))
            {
                return new Token(TokenType.Number, ReadNumber());
            }

            // 解析运算符和括号
            switch (_currentChar)
            {
                case '+':
                    Advance();
                    return new Token(TokenType.Plus);
                case '-':
                    Advance();
                    return new Token(TokenType.Minus);
                case '*':
                    Advance();
                    return new Token(TokenType.Multiply);
                case '/':
                    Advance();
                    return new Token(TokenType.Divide);
                case '(':
                    Advance();
                    return new Token(TokenType.LeftParenthesis);
                case ')':
                    Advance();
                    return new Token(TokenType.RightParenthesis);
                default:
                    throw new Exception($"Invalid character: {_currentChar}");
            }
        }

        // 表达式结束
        return new Token(TokenType.EndOfExpression);
    }
}