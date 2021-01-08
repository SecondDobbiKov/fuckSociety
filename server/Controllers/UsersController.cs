using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using FuckSociety;
using FuckSociety.Models;
using System.Security.Cryptography;
using System.Text;
using Microsoft.AspNetCore.Authorization;
using FuckSociety.Globals;
using Microsoft.IdentityModel.Tokens;
using System.Security.Claims;
using System.IdentityModel.Tokens.Jwt;

namespace FuckSociety.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public UsersController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/Users
        [HttpGet]
        public async Task<ActionResult<IEnumerable<User>>> Getusers()
        {
            return await _context.users.ToListAsync();
        }

        // GET: api/Users/ById/5
        [HttpGet("/api/Users/ById/{id}")]
        public async Task<ActionResult<User>> GetUser(Guid id)
        {
            var user = await _context.users.FindAsync(id);

            if (user == null)
            {
                return NotFound();
            }

            return user;
        }        
        // GET: api/Users/ByToken/5
        [HttpGet("/api/Users/ByToken/{token}")]
        public async Task<ActionResult<User>> GetUser(string token)
        {
            var user = await _context.users.FirstOrDefaultAsync(x => x.jwtToken == token);

            if (user == null)
            {
                return NotFound();
            }

            return user;
        }

        // PUT: api/Users/5
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [Authorize]
        [HttpPut("/api/Users/Update/{id}")]
        public async Task<IActionResult> PutUser(Guid id, User user)
        {
            if (id != user.Id)
            {
                return BadRequest();
            }

            _context.Entry(user).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!UserExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/Users
        // To protect from overposting attacks, enable the specific properties you want to bind to, for
        // more details, see https://go.microsoft.com/fwlink/?linkid=2123754.
        [HttpPost("/api/Users/Register")]
        public async Task<ActionResult<User>> PostUser([FromBody] AuthModel auth)
        {
            var checkUser = await _context.users.FirstOrDefaultAsync(x => x.Login == auth.Login);

            if (checkUser != null)
                return BadRequest(new { errorText = "Такой логин уже есть." });

            var user = new User() { Login = auth.Login };
            _context.users.Add(user);
            await _context.SaveChangesAsync();
            var newUser = await _context.users.FirstOrDefaultAsync(x => x.Login == auth.Login);

            SHA256 hash = SHA256.Create();
            var hashPass = string.Concat(hash.ComputeHash(Encoding.UTF8.GetBytes(auth.Password)).Select(x => x.ToString("X2")));
            var pass = new Password() { PassWord = hashPass, UserId = newUser.Id };
            _context.passwords.Add(pass);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetUser", new { id = newUser.Id }, newUser);
        }

        [HttpPost("/api/Users/AuthUser")]
        public async Task<ActionResult<User>> AuthUser([FromBody] AuthModel auth)
        {
            var checkUser = await _context.users.FirstOrDefaultAsync(x => x.Login == auth.Login);
            if (checkUser == null)
                return BadRequest(new { errorText = "Bad login" });

            SHA256 hash = SHA256.Create();
            var hashPass = string.Concat(hash.ComputeHash(Encoding.UTF8.GetBytes(auth.Password)).Select(x => x.ToString("X2")));

            var checkPass = await _context.passwords.FirstOrDefaultAsync(x => x.UserId == checkUser.Id);
            if (checkPass == null)
                return BadRequest( new { errrText = "Bad password" } );

            checkUser.jwtToken = GenerateJWTToken(checkUser);
            await PutUser(checkUser.Id, checkUser);
            return Ok(new { acces_token = checkUser.jwtToken });
        }
        [HttpPost("/api/Users/UpdateToken")]
        public async Task<ActionResult> Auth([FromBody] UpdateTokenModel utm)
        {
            var user = await _context.users.FirstOrDefaultAsync(x => x.jwtToken == utm.jwtToken);
            if (user == null)
                return NotFound();
            user.jwtToken = GenerateJWTToken(user);
            await PutUser(user.Id, user);
            return Ok(new { acces_token = user.jwtToken });
        }
        private string GenerateJWTToken(User user)
        {
            var securityKey = authJwtOptions.SecretKey;
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

            var claims = new List<Claim>()
            {
                new Claim(System.IdentityModel.Tokens.Jwt.JwtRegisteredClaimNames.Email, user.Login),
                new Claim(System.IdentityModel.Tokens.Jwt.JwtRegisteredClaimNames.Sub, user.Id.ToString())
            };
            claims.Add(new Claim("role", user.RoleId.ToString()));

            var token = new JwtSecurityToken(authJwtOptions.Issuer, authJwtOptions.Audience, claims, expires: DateTime.Now.AddSeconds(3600), signingCredentials: credentials);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        // DELETE: api/Users/5
        [Authorize]
        [HttpDelete("/api/Users/Delete{id}")]
        public async Task<ActionResult<User>> DeleteUser(Guid id)
        {
            var user = await _context.users.FindAsync(id);
            if (user == null)
            {
                return NotFound();
            }

            _context.users.Remove(user);
            await _context.SaveChangesAsync();

            return user;
        }

        private bool UserExists(Guid id)
        {
            return _context.users.Any(e => e.Id == id);
        }
    }
}
