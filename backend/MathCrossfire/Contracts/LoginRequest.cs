using System.ComponentModel.DataAnnotations;

namespace MathCrossfire.Contracts
{
    public record LoginRequest
    {
        [Required(ErrorMessage ="Не введен логин, введите его")]
        public string Login { get; set; }
        [Required(ErrorMessage = "Не введен пароль, введите его")]
        public string Password { get; set; }
    }
}
