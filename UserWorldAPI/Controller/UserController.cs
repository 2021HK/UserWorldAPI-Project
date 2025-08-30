using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Threading.Tasks;
using UserWorldAPI.DataBase;
using UserWorldAPI.Model;
using UserWorldAPI.Model;
using static System.Runtime.InteropServices.JavaScript.JSType;

[Route("api/UserWorld")]
[ApiController]

public class UserControllers : ControllerBase
{
    private readonly DBOperations dBOperations;

    public UserControllers()
    {
        dBOperations = new DBOperations();
    }

    [HttpPost]
    public bool PostUser(User userdata)
    {
        try
        {
            dBOperations.CreateUser(userdata);
            return true;
        }
        catch (Exception ex)
        {
            // Log the exception (ex) as needed
            return false;
        }


    }
    // get all user details
    [HttpGet]
    public ActionResult<List<UserDetails>> GetUser()
    {
        try
        {
            var userDetailList = dBOperations.GetAllUserDetails();

            if (userDetailList == null || userDetailList.Count == 0)

                return NotFound("No users found.");

            return Ok(userDetailList);
        }
        catch (Exception ex)
        {
            // Optionally log the exception here
            return StatusCode(500, $"Internal server error: {ex.Message}");
        }
    }

    // <summary>
    /// Get user details by ID
    /// </summary>
    /// <param name="id">User ID</param>
    /// <returns>User details</returns>
    [HttpGet("{id}")]
    public ActionResult<UserDetails> GetUserById(int id)
    {
        try
        {
            var userDetail = dBOperations.GetUserDetailsById(id);

            if (userDetail == null)
                return NotFound($"User with ID {id} not found.");

            return Ok(userDetail);
        }
        catch (Exception ex)
        {
            // Optionally log the exception here
            return null;
        }
    }

    // <summary>
    ///delete user by ID
    ///

    [HttpDelete("{id}")]
    public bool DeleteUser(int id)
    {
        try
        {
            //var userDetail = dBOperations.GetUserDetailsById(id);

            //if (userDetail == null)
            //{
            //    return false; // User not found
            //}

            dBOperations.DeleteUserById(id);

            return true; // User deleted successfully
        }
        catch (Exception ex)
        {

            return false; // Error occurred while deleting user
        }
    }

    // update user by ID

    [HttpPut("{id}")]
    public bool UpdateUser(User UserData, int id)
    {
        try
        {
            dBOperations.UpdateUser(UserData, id);
            return true; // User updated successfully

        }
        catch (Exception ex)
        {
            // Optionally log the exception here
            return false; // Error occurred while updating user

        }
    }

    // get Nationality list
    [HttpGet("NationalityList")]

    public ActionResult<List<Nationality>> GetAll()
    {
        try
        {
            var nationalityList = dBOperations.GetAllNationalities();
            if (nationalityList == null || nationalityList.Count == 0)
            {
                return NotFound("No nationalities found.");
            }
            return Ok(nationalityList);
        }
        catch (Exception ex)
        {
            return null; // Optionally log the exception here
        }
    }

    // get Country list

    [HttpGet("CountryList")]
    public ActionResult<List<Country>> GetAllCountries()
    {
        try
        {
            var countryList = dBOperations.GetAllCountries();
            if (countryList == null || countryList.Count == 0)
            {
                return NotFound("No countries found.");
            }
            return Ok(countryList);
        }
        catch (Exception ex)
        {
            return null; // Optionally log the exception here
        }
    }

    // get State list by country ID
    [HttpGet("StateList/{countryId}")]

    public ActionResult<List<State>> GetStatesByCountryId(int countryId)
            {
        try
        {
            var stateList = dBOperations.GetStatesByCountryId(countryId);
            if (stateList == null || stateList.Count == 0)
            {
                return NotFound($"No states found for country ID {countryId}.");
            }
            return Ok(stateList);
        }
        catch (Exception ex)
        {
            return null; // Optionally log the exception here
        }
    }

    // get City list by state ID

    [HttpGet("CityList/{stateId}")]

    public ActionResult<List<City>> GetCitiesByStateId(int stateId)
    {
        try
        {
            var cityList = dBOperations.GetCitiesByStateId(stateId);
            if (cityList == null || cityList.Count == 0)
            {
                return NotFound($"No cities found for state ID {stateId}.");
            }
            return Ok(cityList);
        }
        catch (Exception ex)
        {
            return null; // Optionally log the exception here
        }
    }
}

