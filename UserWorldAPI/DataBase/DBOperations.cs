using MediaBrowser.Model.Globalization;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.Data.SqlClient;
using System.Data;
using System.Data.SqlClient;
using System.Diagnostics.Metrics;
using System.Reflection.Metadata.Ecma335;
using UserWorldAPI.Model;
using UserWorldAPI.Model;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace UserWorldAPI.DataBase
{
    public class DBOperations
    {
        string connectionString = "Server=DESKTOP-2P6DFOB\\SQLEXPRESS01;Database=UserWorldDB;Trusted_Connection=True;Encrypt=False;MultipleActiveResultSets=true";

        private SqlTransaction transaction;

        public SqlTransaction SqlTransaction { get; private set; }

        // create a new user

        public void CreateUser(User user)
        {
            using (SqlConnection databaseConnection = new SqlConnection(connectionString))
            {
                databaseConnection.Open();
                // validate city-state-country 
                string validateLocationQuery = @"SELECT COUNT(*) FROM Cities ci
                                                INNER JOIN States s ON ci.StateId = s.StateId
                                                INNER JOIN Countries c ON s.CountryId = c.CountryId
                                                WHERE ci.CityId = @CityId AND s.StateId = @StateId AND c.CountryId = @CountryId";
                using (SqlCommand validateCmd = new SqlCommand(validateLocationQuery, databaseConnection))
                {
                    validateCmd.Parameters.AddWithValue("@CityId", user.CityId);
                    validateCmd.Parameters.AddWithValue("@StateId", user.StateId);
                    validateCmd.Parameters.AddWithValue("@CountryId", user.CountryId);
                    int locationCount = (int)validateCmd.ExecuteScalar();
                    if (locationCount == 0)
                    {
                        throw new Exception("Invalid City, State, or Country combination."); 
                    }
                }


                    string Query = @"INSERT INTO Users 
                                  ( FullName, Email, Username, Password, DateOfBirth,
                                    ContactNumber, Address, NationalityId, CountryId, StateId, CityId,Gender, Profession, PhotoPath, AboutYourself)

                             VALUES 
                                    (@FullName, @Email, @Username, @Password, @DateOfBirth,
                                        @ContactNumber, @Address, @NationalityId, @CountryId, @StateId, @CityId, @Gender, @Profession, @PhotoPath, @AboutYourself);
                        SELECT Scope_Identity();";


                using (SqlCommand cmd = new SqlCommand(Query, databaseConnection))
                {
                    cmd.Parameters.AddWithValue("@FullName", user.FullName);
                    cmd.Parameters.AddWithValue("@Email", user.Email);
                    cmd.Parameters.AddWithValue("@Username", user.Username);
                    cmd.Parameters.AddWithValue("@Password", user.Password);
                    cmd.Parameters.AddWithValue("@DateOfBirth", user.DateOfBirth);
                    cmd.Parameters.AddWithValue("@ContactNumber", user.ContactNumber);
                    cmd.Parameters.AddWithValue("@Address", user.Address ?? (object)DBNull.Value);
                    cmd.Parameters.AddWithValue("@NationalityId", user.NationalityId);
                    cmd.Parameters.AddWithValue("@CountryId", user.CountryId);
                    cmd.Parameters.AddWithValue("@StateId", user.StateId);
                    cmd.Parameters.AddWithValue("@CityId", user.CityId);
                    cmd.Parameters.AddWithValue("@Gender", user.Gender);
                    cmd.Parameters.AddWithValue("@Profession", user.Profession ?? (object)DBNull.Value);
                    cmd.Parameters.AddWithValue("@PhotoPath", user.PhotoPath);
                    cmd.Parameters.AddWithValue("@AboutYourself", user.AboutYourself ?? (object)DBNull.Value);

                    //databaseConnection.Open();

                    var excuteQuery = cmd.ExecuteScalar();

                    int userId = Convert.ToInt32(excuteQuery);

                    if (user.LanguagesKnown != null && user.LanguagesKnown.Count > 0)
                    {
                        // Loop through each language and insert into UserLanguages table
                        foreach (int languageId in user.LanguagesKnown)
                        {
                            string languageInsertQuery = "INSERT INTO UserLanguages (UserID, LanguageID) VALUES (@UserID, @LanguageID)";

                            // Prepare SQL command to insert user language
                            using (SqlCommand langCmd = new SqlCommand(languageInsertQuery, databaseConnection))
                            {
                                langCmd.Parameters.AddWithValue("@UserID", userId);

                                langCmd.Parameters.AddWithValue("@LanguageID", languageId);

                                langCmd.ExecuteNonQuery();
                            }
                        }
                    }
                }


            }
        }

        // Get all users
        public List<UserDetails> GetAllUserDetails()
        {
            List<UserDetails> userDetailList = new List<UserDetails>();

            using (SqlConnection conn = new SqlConnection(connectionString))
            {
                string query = @"
                            SELECT 
                                u.UserId, u.FullName, u.Email, u.UserName, u.Password, u.DateOfBirth,
                                u.ContactNumber, u.Address, u.Gender, u.Profession, u.PhotoPath AS PhotoFilePath, u.AboutYourself,

                                n.NationalityId, n.NationalityName,
                                c.CountryId, c.CountryName,
                                s.StateId, s.StateName,
                                ci.CityId, ci.CityName

                            FROM Users u
                            LEFT JOIN Nationalities n ON u.NationalityId = n.NationalityId
                            LEFT JOIN Countries c ON u.CountryId = c.CountryId
                            LEFT JOIN States s ON u.StateId = s.StateId AND s.CountryId = u.CountryId
                            LEFT JOIN Cities ci ON u.CityId = ci.CityId AND ci.StateId = u.StateId";

                using (SqlCommand cmd = new SqlCommand(query, conn))
                {
                    conn.Open();
                    SqlDataReader reader = cmd.ExecuteReader();

                    while (reader.Read())
                    {
                        var user = new UserDetails
                        {
                            Id = (int)reader["UserId"],
                            FullName = reader["FullName"].ToString(),
                            Email = reader["Email"].ToString(),
                            Username = reader["UserName"].ToString(),
                            Password = reader["Password"].ToString(),
                            DateOfBirth = (DateTime)(reader["DateOfBirth"] != DBNull.Value ? Convert.ToDateTime(reader["DateOfBirth"]) : (DateTime?)null),
                            ContactNumber = reader["ContactNumber"].ToString(),
                            Address = reader["Address"].ToString(),
                            Gender = Enum.TryParse(reader["Gender"].ToString(), out Gender g) ? g : Gender.Other,
                            Profession = reader["Profession"].ToString(),
                            PhotoPath = reader["PhotoFilePath"].ToString(),
                            AboutYourself = reader["AboutYourself"].ToString(),

                            NationalityId = new Nationality
                            {
                                NationalityId = reader["NationalityId"] != DBNull.Value ? (int)reader["NationalityId"] : 0,
                                NationalityName = reader["NationalityName"].ToString()
                            },
                            CountryId = new Country
                            {
                                CountryId = reader["CountryId"] != DBNull.Value ? (int)reader["CountryId"] : 0,
                                CountryName = reader["CountryName"].ToString()
                            },
                            StateId = new State
                            {
                                StateId = reader["StateId"] != DBNull.Value ? (int)reader["StateId"] : 0,
                                StateName = reader["StateName"].ToString()
                            },
                            CityId = new City
                            {
                                CityId = reader["CityId"] != DBNull.Value ? (int)reader["CityId"] : 0,
                                CityName = reader["CityName"].ToString()
                            },
                            LanguagesKnown = new List<Language>()
                        };

                        userDetailList.Add(user);
                    }
                    reader.Close();
                }

                // Fetch languages for each user
                foreach (var user in userDetailList)
                {
                    string langQuery = @"SELECT ul.UserId, ul.LanguageId, l.LanguageName
                                         FROM UserLanguages ul
                                         INNER JOIN Languages l ON ul.LanguageId = l.LanguageId
                                         WHERE ul.UserId = @UserID";

                    using (SqlCommand langCmd = new SqlCommand(langQuery, conn))
                    {
                        langCmd.Parameters.AddWithValue("@UserID", user.Id);

                        using (SqlDataReader langReader = langCmd.ExecuteReader())
                        {
                            while (langReader.Read())
                            {
                                user.LanguagesKnown.Add(new Language
                                {
                                    LanguageId = (int)langReader["LanguageId"],
                                    LanguageName = langReader["LanguageName"].ToString()
                                });
                            }
                        }
                    }
                }
            }

            return userDetailList;
        }

        // Get user by ID
        public UserDetails GetUserDetailsById(int userId)

        {
            //
            UserDetails userDetails = new UserDetails();

            using (SqlConnection conn = new SqlConnection(connectionString))
            {
                string query = @"SELECT 
                            u.UserId, u.FullName, u.Email, u.UserName, u.Password, u.DateOfBirth,
                            u.ContactNumber, u.Address, u.Gender, u.Profession, u.PhotoPath AS PhotoFilePath, u.AboutYourself,

                                n.NationalityId, n.NationalityName,
                                c.CountryId, c.CountryName,
                                s.StateId, s.StateName,
                                ci.CityId, ci.CityName

                            FROM Users u
                                    LEFT JOIN Nationalities n ON u.NationalityId = n.NationalityId
                                    LEFT JOIN Countries c ON u.CountryId = c.CountryId
                                    LEFT JOIN States s ON u.StateId = s.StateId AND s.CountryId = u.CountryId
                                     LEFT JOIN Cities ci ON u.CityId = ci.CityId AND ci.StateId = u.StateId
                                     WHERE u.UserId = @UserId";

                using (SqlCommand cmd = new SqlCommand(query, conn))
                {
                    cmd.Parameters.AddWithValue("@UserId", userId);

                    conn.Open();

                    SqlDataReader reader = cmd.ExecuteReader();


                    if (!reader.HasRows)
                    {
                        return null; // No user found with the given ID

                    }

                    while (reader.Read())
                    {
                        var UserObj = new UserDetails();

                        UserObj.Id = (int)reader["UserId"];
                        UserObj.FullName = reader["FullName"].ToString();
                        UserObj.Email = reader["Email"].ToString();
                        UserObj.Username = reader["UserName"].ToString();
                        UserObj.Password = reader["Password"].ToString();
                        UserObj.DateOfBirth = (DateTime)(reader["DateOfBirth"] != DBNull.Value ? Convert.ToDateTime(reader["DateOfBirth"]) : (DateTime?)null);
                        UserObj.ContactNumber = reader["ContactNumber"].ToString();
                        UserObj.Address = reader["Address"].ToString();
                        UserObj.Profession = reader["Profession"].ToString();
                        UserObj.PhotoPath = reader["PhotoFilePath"].ToString();
                        UserObj.AboutYourself = reader["AboutYourself"].ToString();

                        UserObj.NationalityId = new Nationality
                        {
                            NationalityId = reader["NationalityId"] != DBNull.Value ?
                            (int)reader["NationalityId"] : 0,
                            NationalityName = reader["NationalityName"].ToString()
                        };

                        UserObj.CountryId = new Country
                        {
                            CountryId = reader["CountryId"] != DBNull.Value ?
                            (int)reader["CountryId"] : 0,
                            CountryName = reader["CountryName"].ToString()

                        };

                        UserObj.StateId = new State
                        {
                            StateId = reader["StateId"] != DBNull.Value ?
                            (int)reader["StateId"] : 0,
                            StateName = reader["StateName"].ToString()
                        };

                        UserObj.CityId = new City
                        {
                            CityId = reader["CityId"] != DBNull.Value ?
                            (int)reader["CityId"] : 0,
                            CityName = reader["CityName"].ToString()
                        };

                        UserObj.Gender = Enum.TryParse(reader["Gender"].ToString(), true, out Gender genderVal)
                            ? genderVal : Gender.Other;


                        UserObj.LanguagesKnown = new List<Language>(); // Populated later


                        //Add user to the list
                        userDetails = UserObj;

                    }

                    reader.Close();

                    // Fetch languages for the user

                    string langQuery = @"SELECT ul.UserId, ul.LanguageId, l.LanguageName
                                     FROM UserLanguages ul
                                     INNER JOIN Languages l ON ul.LanguageId = l.LanguageId
                                     WHERE ul.UserId = @UserID";

                    using (SqlCommand langcmd = new SqlCommand(langQuery, conn))
                    {
                        langcmd.Parameters.AddWithValue("@UserID", userId);
                        using (SqlDataReader langReader = langcmd.ExecuteReader())
                        {
                            while (langReader.Read())
                            {
                                userDetails.LanguagesKnown.Add(new Language
                                {
                                    LanguageId = (int)langReader["LanguageId"],
                                    LanguageName = langReader["LanguageName"].ToString()
                                });
                            }
                        }
                    }


                }
                return userDetails;


            }

        }

        //Delete user by ID

        public bool DeleteUserById(int userId)
        {
            using (SqlConnection conn = new SqlConnection(connectionString))
            {
                conn.Open();

                using (SqlTransaction transaction = conn.BeginTransaction())
                {
                    try
                    {
                        string deleteLanguagesQuery = "DELETE FROM UserLanguages WHERE UserID = @userId";

                        using (SqlCommand cmdLanguages = new SqlCommand(deleteLanguagesQuery, conn, transaction))
                        {
                            cmdLanguages.Parameters.AddWithValue("@userId", userId);
                            cmdLanguages.ExecuteNonQuery();

                        }
                        // Delete user from Users table

                        string deleteUserQuery = "DELETE FROM Users WHERE UserId = @userId";
                        using (SqlCommand cmdUser = new SqlCommand(deleteUserQuery, conn, transaction))
                        {
                            cmdUser.Parameters.AddWithValue("@userId", userId);
                            int rowsAffected = cmdUser.ExecuteNonQuery();
                            if (rowsAffected > 0)
                            {
                                transaction.Commit();
                                return true; // User deleted successfully
                            }
                            else
                            {
                                transaction.Rollback();
                                return false; // User not found or deletion failed
                            }
                        }

                    }
                    catch (Exception ex)
                    {
                        // Log the exception (ex) as needed
                        transaction.Rollback();
                        return false; // An error occurred during deletion
                    }
                }
            }
        }

        //update users by userId 

        public void UpdateUser(User user, int userId)
        {
            using (SqlConnection databaseConnection = new SqlConnection(connectionString))
            {
                databaseConnection.Open();

                using (SqlTransaction transaction = databaseConnection.BeginTransaction())
                {
                    try
                    {
                        // validate city-state-country
                        string validateLocationQuery = @"SELECT COUNT(*) FROM Cities ci
                                                INNER JOIN States s ON ci.StateId = s.StateId
                                                INNER JOIN Countries c ON s.CountryId = c.CountryId
                                                WHERE ci.CityId = @CityId AND s.StateId = @StateId AND c.CountryId = @CountryId";

                        using (SqlCommand validateCmd = new SqlCommand(validateLocationQuery, databaseConnection, transaction))
                        {
                            validateCmd.Parameters.AddWithValue("@CityId", user.CityId);
                            validateCmd.Parameters.AddWithValue("@StateId", user.StateId);
                            validateCmd.Parameters.AddWithValue("@CountryId", user.CountryId);
                            int locationCount = (int)validateCmd.ExecuteScalar();
                            if (locationCount == 0)
                            {
                                throw new Exception("Invalid City, State, or Country combination.");
                            }
                        }
                            // update user details in the users table 

                            string updateUserQuery = @"UPDATE Users SET
                                                  FullName = @FullName,
                                                 Email = @Email,
                                                 Username = @Username,
                                                 Password = @Password,
                                                 DateOfBirth = @DateOfBirth,
                                                 ContactNumber = @ContactNumber,
                                                 Address = @Address,
                                                 NationalityId = @NationalityId,
                                                 CountryId = @CountryId,
                                                 StateId = @StateId,
                                                 CityId = @CityId,
                                                 Gender = @Gender,
                                                 Profession = @Profession,
                                                 PhotoPath = @PhotoPath,
                                                 AboutYourself = @AboutYourself
                                                 WHERE UserId = @UserId";

                        using (SqlCommand cmd = new SqlCommand(updateUserQuery, databaseConnection, transaction))
                        {
                            cmd.Parameters.AddWithValue("@UserId", userId);
                            cmd.Parameters.AddWithValue("@FullName", user.FullName);
                            cmd.Parameters.AddWithValue("@Email", user.Email);
                            cmd.Parameters.AddWithValue("@Username", user.Username);
                            cmd.Parameters.AddWithValue("@Password", user.Password);
                            cmd.Parameters.AddWithValue("@DateOfBirth", user.DateOfBirth);
                            cmd.Parameters.AddWithValue("@ContactNumber", user.ContactNumber);
                            cmd.Parameters.AddWithValue("@Address", user.Address ?? (object)DBNull.Value);
                            cmd.Parameters.AddWithValue("@NationalityId", user.NationalityId);
                            cmd.Parameters.AddWithValue("@CountryId", user.CountryId);
                            cmd.Parameters.AddWithValue("@StateId" , user.StateId);
                            cmd.Parameters.AddWithValue("@CityId", user.CityId);
                            cmd.Parameters.AddWithValue("@Gender", user.Gender);
                            cmd.Parameters.AddWithValue("@Profession", user.Profession ?? (object)DBNull.Value);
                            cmd.Parameters.AddWithValue("@PhotoPath", user.PhotoPath);
                            cmd.Parameters.AddWithValue("@AboutYourself", user.AboutYourself ?? (object)DBNull.Value);

                            // Use the provided userId for the update

                            cmd.ExecuteNonQuery();

                        }

                        //update user languages in the UserLanguages table

                        string deleteLanguagesQuery = "DELETE FROM UserLanguages WHERE UserId = @UserId";
                        using (SqlCommand cmdDeleteLanguages = new SqlCommand(deleteLanguagesQuery, databaseConnection, transaction))
                        {
                            cmdDeleteLanguages.Parameters.AddWithValue("@UserId", userId);
                            cmdDeleteLanguages.ExecuteNonQuery();

                        }
                        // Insert updated languages into UserLanguages table
                        if (user.LanguagesKnown != null && user.LanguagesKnown.Count > 0)
                        {
                            foreach (int languageId in user.LanguagesKnown)
                            {
                                string insertLanguageQuery = "INSERT INTO UserLanguages (UserId, LanguageId) VALUES (@UserId, @LanguageId)";
                                using (SqlCommand cmdInsertLanguage = new SqlCommand(insertLanguageQuery, databaseConnection, transaction))
                                {
                                    cmdInsertLanguage.Parameters.AddWithValue("@UserId", userId);
                                    cmdInsertLanguage.Parameters.AddWithValue("@LanguageId", languageId);
                                    cmdInsertLanguage.ExecuteNonQuery();
                                }
                            }
                        }
                        transaction.Commit();

                    }
                    catch (Exception ex)
                    {
                        // Log the exception (ex) as needed
                        transaction.Rollback();

                        throw; // Re-throw the exception for further handling if needed
                    }
                }
            }
        }

        // Get Nationality id and list of nationalities
        public List<Nationality> GetAllNationalities()
        {
            // This method retrieves all nationalities from the database and returns them as a list of National
            List<Nationality> nationalityList = new List<Nationality>();

            // Ensure the connection string is correct and points to your database
            using (SqlConnection conn = new SqlConnection(connectionString))
            {
                // SQL query to select all nationalities
                string query = "SELECT NationalityId, NationalityName FROM Nationalities";

                // Create a SqlCommand to execute the query
                using (SqlCommand cmd = new SqlCommand(query, conn))
                {
                    conn.Open();

                    // Execute the command and read the results
                    using (SqlDataReader reader = cmd.ExecuteReader())
                    {
                        // Check if the reader has rows
                        while (reader.Read())
                        {
                            // Create a new Nationaliy object and populate it with data from the reader
                            var nationality = new Nationality
                            {
                                // Use the reader to get the values for NationalityId and NationalityName
                                NationalityId = reader["NationalityId"] != DBNull.Value ? (int)reader["NationalityId"] : 0,

                                NationalityName = reader["NationalityName"].ToString()
                            };
                            // Add the Nationalality object to the list
                            nationalityList.Add(nationality);
                        }
                    }
                }
            }
            return nationalityList;
        }

        // Get Country Id and List for Countres 

        public List<Country> GetAllCountries()
        {
            List<Country> countryList = new List<Country>();

            using (SqlConnection conn = new SqlConnection(connectionString))
            {

                // write the Sql Query for list of country
                string query = "SELECT CountryId, CountryName FROM Countries";

                using (SqlCommand cmd = new SqlCommand(query, conn))
                {
                    conn.Open();

                    using (SqlDataReader reader = cmd.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            var Country = new Country
                            {
                                CountryId = reader["CountryId"] != DBNull.Value ? (int)reader["CountryId"] : 0,

                                CountryName = reader["CountryName"].ToString()

                            };
                            countryList.Add(Country);
                        }
                    }

                }
            }
            return countryList;

        }

        // get State Id and List of States by Country Id
        public List<State> GetStatesByCountryId(int countryId)
        {
            List<State> stateList = new List<State>();
            using (SqlConnection conn = new SqlConnection(connectionString))
            {
                // write the Sql Query for list of states by country id
                string query = "SELECT StateId, StateName FROM States WHERE CountryId = @CountryId";
                using (SqlCommand cmd = new SqlCommand(query, conn))
                {
                    //insert the country id as parameter to the query
                    
                    cmd.Parameters.AddWithValue("@CountryId", countryId);

                    conn.Open();

                    using (SqlDataReader reader = cmd.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            var state = new State
                            {
                                StateId = reader["StateId"] != DBNull.Value ? (int)reader["StateId"] : 0,
                                StateName = reader["StateName"].ToString()
                            };
                            stateList.Add(state);
                        }
                    }
                }
            }
            return stateList;

        }

        //Get city id and list of cities by state id

        public List<City>GetCitiesByStateId(int satateId)
        {
            List<City> cityList = new List<City>();
            using (SqlConnection conn = new SqlConnection(connectionString))
            {
                // write the Sql Query for list of cities by satate id 
                string query = "SELECT CityId, CityName FROM Cities WHERE StateId = @StateId";
                using (SqlCommand cmd = new SqlCommand(query, conn))
                {
                    cmd.Parameters.AddWithValue("@StateId", satateId);

                    conn.Open();

                    using (SqlDataReader reader = cmd.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            var city = new City
                            {
                                CityId = reader["CityId"] != DBNull.Value ? (int)reader["CityId"] : 0,
                                CityName = reader["CityName"].ToString()
                            };
                            cityList.Add(city);
                        }
                    }
                }
            }

            return cityList;
        }
    }
}

