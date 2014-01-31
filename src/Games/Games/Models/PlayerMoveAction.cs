namespace Games.Models
{
    public class PlayerMoveAction : PlayerAction
    {
        public override PlayerActionType ActionType
        {
            get { return PlayerActionType.Move; }
        }

        public PlayerPosition Position { get; set; }
    }
}