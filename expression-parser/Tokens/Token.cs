namespace expression_parser.Tokens;

public class Token
{
    public TokenType Type { get; }
    public string Value { get; }

    public Token(TokenType type, string value = null)
    {
        Type = type;
        Value = value;
    }

    public override string ToString() => Value != null ? $"{Type}({Value})" : $"{Type}";
}
