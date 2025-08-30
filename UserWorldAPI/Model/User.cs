namespace UserWorldAPI.Model
{
    public class User
    {
        public string FullName { get; set; }

        public string Email { get; set; }

        public string Username { get; set; }

        public string Password { get; set; }

        public DateTime DateOfBirth { get; set; }

        public string ContactNumber { get; set; }

        public string Address { get; set; }

        public int NationalityId { get; set; }

        public int CountryId { get; set; }

        public int StateId { get; set; }

        public int CityId { get; set; }

        public Gender Gender { get; set; }

        public string? Profession { get; set; }

        public string PhotoPath { get; set; }

        public string? AboutYourself { get; set; }
        public List<int> LanguagesKnown { get; set; }
    }
}
