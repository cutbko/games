namespace Games.Models
{
    public class PlayerLeftAction : PlayerAction
    {
        public override PlayerActionType ActionType
        {
            get { return PlayerActionType.Left; }
        }
    }
}