﻿using System.Runtime.Serialization;

[Serializable]
internal class BusinessException : Exception
{
    public BusinessException()
    {
    }

    public BusinessException(string? message) : base(message)
    {
    }

    public BusinessException(string? message, Exception? innerException) : base(message, innerException)
    {
    }

    protected BusinessException(SerializationInfo info, StreamingContext context) : base(info, context)
    {
    }
}