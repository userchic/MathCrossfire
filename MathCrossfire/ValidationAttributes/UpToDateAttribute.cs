using System.ComponentModel.DataAnnotations;

namespace MathCrossfire.ValidationAttributes
{
    public class UpToDateAttribute : ValidationAttribute
    {
        public UpToDateAttribute()
        {

        }
        public override bool IsValid(object? value)
        {
            if (value is null) return false;
            return (DateTime)value > DateTime.Now;
        }
    }
}
