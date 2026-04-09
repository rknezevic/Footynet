namespace Footynet.Models;

public class Admin : User
{
    public override RoleType Role => RoleType.Admin;
}