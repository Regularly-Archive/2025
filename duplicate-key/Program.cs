using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using MongoDB.Bson;
using MongoDB.Driver;

class Program
{
    private static readonly IMongoClient Client = new MongoClient("mongodb://root:123456@127.0.0.1:27017/test_20150116?authSource=admin");
    private static readonly IMongoDatabase Database = Client.GetDatabase("test_20150116");
    private static readonly IMongoCollection<BsonDocument> OrdersCollection = Database.GetCollection<BsonDocument>("Orders");
    private static readonly IMongoCollection<BsonDocument> ArchivedOrdersCollection = Database.GetCollection<BsonDocument>("ArchivedOrders");

    static async Task Main(string[] args)
    {
        // 清理集合，方便测试
        await OrdersCollection.DeleteManyAsync(Builders<BsonDocument>.Filter.Empty);
        await ArchivedOrdersCollection.DeleteManyAsync(Builders<BsonDocument>.Filter.Empty);

        // 准备原始数据
        var orders = new List<BsonDocument>
        {
            new BsonDocument { { "_id", 1 }, { "OrderNumber", "A001" }, { "Amount", 100 } },
            new BsonDocument { { "_id", 2 }, { "OrderNumber", "A002" }, { "Amount", 200 } },
            new BsonDocument { { "_id", 3 }, { "OrderNumber", "A003" }, { "Amount", 300 } }
        };
        await OrdersCollection.InsertManyAsync(orders);

        Console.WriteLine("Initial Orders:");
        var initialOrders = await OrdersCollection.Find(Builders<BsonDocument>.Filter.Empty).ToListAsync();
        Console.WriteLine(initialOrders.ToJson());

        // 模拟从 Orders 集合读取数据，并存入 ArchivedOrders 集合
        var ordersToArchive = await OrdersCollection.Find(Builders<BsonDocument>.Filter.Empty).ToListAsync();

        var bulkOperations = ordersToArchive.Select(order =>
        {
            // 创建一个新的文档并添加 ArchivedDate 字段
            var archivedOrder = order;
            //var archivedOrder = order.DeepClone().AsBsonDocument; // 深拷贝避免修改原始数据
            archivedOrder.Add(new BsonElement("ArchivedDate", DateTime.UtcNow));

            // 构建 ReplaceOneModel，用于 BulkWrite
            var filter = Builders<BsonDocument>.Filter.Eq("_id", archivedOrder["_id"]);
            return new ReplaceOneModel<BsonDocument>(filter, archivedOrder) { IsUpsert = true };
        }).ToList();

        try
        {
            // 执行批量写入
            await ArchivedOrdersCollection.BulkWriteAsync(bulkOperations);
            Console.WriteLine("Archived Orders written successfully.");
        }
        catch (MongoBulkWriteException ex)
        {
            Console.WriteLine("Error during BulkWrite:");
            foreach (var error in ex.WriteErrors)
            {
                Console.WriteLine($"Error: {error.Message}");
            }
        }

        // 查看最终的 ArchivedOrders 集合
        var archivedOrders = await ArchivedOrdersCollection.Find(Builders<BsonDocument>.Filter.Empty).ToListAsync();
        Console.WriteLine("Archived Orders:");
        Console.WriteLine(archivedOrders.ToJson());
    }
}
