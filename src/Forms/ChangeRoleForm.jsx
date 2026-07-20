import Card from "../components/Card.jsx";
import Form from "../components/Form.jsx";


const ChangeRoleForm = ({
 open,
 onClose,
 onSubmit,
 currentRole,
 loading,
 apiError
})=>{


if(!open) return null;



const fields=[

{
 name:"role",
 label:"Select Role",
 type:"select",

 options:[
 {
  label:"Member",
  value:"member"
 },
 {
  label:"Manager",
  value:"manager"
 },
 {
  label:"Admin",
  value:"admin"
 }
 ],

 validation:{
  required:"Role is required"
 }

}

];



return (

<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">


<Card className="w-full max-w-md">


<h2 className="text-xl text-white font-bold mb-4">
Change Member Role
</h2>



<p className="text-gray-400 mb-3">
Current Role:
<span className="text-white ml-2">
{currentRole}
</span>
</p>



<Form

fields={fields}

defaultValues={{
 role:currentRole
}}

onSubmit={onSubmit}

onClose={onClose}

submitLabel={
 loading
 ? "Updating..."
 : "Update Role"
}

apiError={apiError}

/>



</Card>


</div>

)

}


export default ChangeRoleForm;