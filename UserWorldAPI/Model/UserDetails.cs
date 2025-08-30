namespace UserWorldAPI.Model
{
    public class UserDetails
    {
        public int Id { get; set; }

        public string FullName { get; set; }

        public string Email { get; set; }

        public string Username { get; set; }

        public string Password { get; set; }
        public DateTime DateOfBirth { get; set; }
        public string ContactNumber { get; set; }
        public string Address { get; set; }
        public Nationality NationalityId { get; set; }
        public Country CountryId { get; set; }
        public State StateId { get; set; }
        public City CityId { get; set; }

        public Gender Gender { get; set; }

        public string? Profession { get; set; }

        public string PhotoPath { get; set; }
        public string? AboutYourself { get; set; }
        public List<Language> LanguagesKnown { get; set; }
    }
}
