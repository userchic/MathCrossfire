namespace MathCrossfire.Models
{
    public class Class
    {
        public string Name { get; set; }
        public int ID { get; set; }
        public ICollection<Users> Users { get; set; }
        public Class() 
        {
            Users= new List<Users>();
        }
    }
}
