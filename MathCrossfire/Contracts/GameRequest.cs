using MathCrossfire.Models;
using MathCrossfire.ValidationAttributes;
using System.ComponentModel.DataAnnotations;

namespace MathCrossfire.Contracts
{
    public record GameRequest
    {

        [Required(ErrorMessage = "Не введено название игры.")]
        public string Name { get; set; }

        [Required(ErrorMessage = "Не введено время/дата начала игры, введите его.")]
        [UpToDate(ErrorMessage ="Введенная дата может соответствовать только моменту времени в будущем.")]
        public DateTime StartDate { get; set; }
        [Required(ErrorMessage ="Не введена длительность игры,введите ее.")]
        [Range(10,240,ErrorMessage ="Неправильная длительность игра, допустимы игры длительностью от 10 минут до 240 мин.")]
        public int Length { get; set; }
        [MinLength(1, ErrorMessage = "Не выбраны задачи для игры. Выберите хотя бы одну.")]
        public int[] TasksIds { get; set; }
        public int Id { get; set; }
    }
}
