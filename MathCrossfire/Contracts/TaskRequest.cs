using System.ComponentModel.DataAnnotations;

namespace MathCrossfire.Contracts
{
    public record TaskRequest
    {
        [Required(ErrorMessage ="Не введен текст задачи, введите его.")]
        public string Text { get; set; }
        [Required(ErrorMessage ="Не введен ответ задачи, введите его.")]
        public string Answer { get; set; }
        public int Id { get; set; }
    }
}
