using MathCrossfire.Models;

namespace MathCrossfire.Abstractions
{
    public interface IUserRepository
    {
        Users GetUser(string id);
        ICollection<Users> GetUsers();
        void CreateUser(Users user);
        void UpdateUser(Users user);
        void DeleteUser(Users user);
        void Save();
    }
}
