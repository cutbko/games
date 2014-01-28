namespace Games.Models
{
    public class PlayerMoveAction : PlayerAction
    {
        public override PlayerActionType ActionType
        {
            get { return PlayerActionType.Move; }
        }

        public double X { get; set; }

        public double Y { get; set; }
    }
}