using System.ComponentModel.DataAnnotations;

namespace MathCrossfire.Contracts
{
    public record RegisterRequest
    {
        [Required(ErrorMessage ="Не введен логин, введите его")]
        public string Login { get; set; }
        [Required(ErrorMessage ="Не введен пароль, введите его")]
        [Length(5,20,ErrorMessage ="Пароль должен быть длиной от 5 до 20 символов")]
        public string Password { get; set; }
        [Required(ErrorMessage ="Не введено имя, введите его")]
        public string Name {get;set; }
        [Required(ErrorMessage ="Не введена фамилия, введите его")]
        public string Surname {get;set; }
        public string? Fatname {get;set;}
        [AllowedValues("1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "not class",ErrorMessage ="В качестве класса можно указать число от 1 до 11 или \"не класс\" ")]
        public string @Class { get; set; }
    }
}
