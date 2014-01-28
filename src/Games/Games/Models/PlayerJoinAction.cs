namespace Games.Models
{
    public class PlayerJoinAction : PlayerAction
    {
        public override PlayerActionType ActionType
        {
            get { return PlayerActionType.Join; }
        }

        public int PlayerId { get; set; }
    }
}