using Newtonsoft.Json;
using Newtonsoft.Json.Converters;

namespace Games.Models
{
    public abstract class PlayerAction
    {
        [JsonConverter(typeof (StringEnumConverter))]
        public abstract PlayerActionType ActionType { get; }

        public int PlayerId { get; set; }
    }
}