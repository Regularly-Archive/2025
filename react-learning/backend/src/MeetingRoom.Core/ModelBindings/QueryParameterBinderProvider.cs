using MeetingRoom.Infrastructure.Models;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MeetingRoom.Core.ModelBindings
{
    public class QueryParameterBinderProvider : IModelBinderProvider
    {
        public IModelBinder GetBinder(ModelBinderProviderContext context)
        {
            if (context.Metadata.ModelType.IsGenericType &&
                context.Metadata.ModelType.GetGenericTypeDefinition() == typeof(QueryParameter<,>))
            {
                var entityType = context.Metadata.ModelType.GetGenericArguments()[0];
                var filterType = context.Metadata.ModelType.GetGenericArguments()[1];
                var binderType = typeof(QueryParameterBinder<,>).MakeGenericType(entityType, filterType);
                return (IModelBinder)Activator.CreateInstance(binderType);
            }

            return null;
        }
    }
}
