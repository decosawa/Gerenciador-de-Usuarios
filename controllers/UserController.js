class UserController{

    constructor(formId, tableId){

        this.formEl = document.getElementById(formId);
        this.tableEl = document.getElementById(tableId);

        this.onSubmit();
        this.onCancel();

    }

    //Pegando valores do formulário
    getValuesFromForm(){

        let user = {};
        let isValid = true;

        //let é uma variável que só existe dentro de um bloco de código
        //Spread (...) é um operador que possibilita que você não precise mostrar quantos índices o Array vai ter
        [...this.formEl.elements].forEach(function(field, index){

            if(['name','email','password'].indexOf(field.name) > -1 && !field.value){

                field.parentElement.classList.add("has-error")
                isValid = false;

            }

            if(field.name == "gender" && field.checked){
                
                user[field.name]=field.value;
         
            }
            else if(field.name=="admin") {

                user[field.name]=field.checked;

            }
            else
            {
           
                user[field.name]=field.value;
         
            }
         });

         if(!isValid){

            return false;

         }
       
         //Um objeto é uma variável que instancia/representa uma classe
         return new User(user.name,user.gender,user.birth,user.country,user.email,user.password,user.photo,user.admin);

    }
    //Pegando a foto anexada pelo usuário
    getPhoto(){

        return new Promise((resolve, reject) => {

            let fileReader = new FileReader();

            let elements = [...this.formEl.elements].filter(item=>{

              if(item.name==="photo") return item;

            })

            let file = elements[0].files[0];
            fileReader.onload = ()=>{

                resolve(fileReader.result);

            };
            fileReader.onerror=(e)=>{

                reject(e);

            }
            
            if(file){

                file.readAsDataURL(file);

            }
            else{

                resolve('dist/img/boxed-bg.jpg');

            }

        });
    }

    //Botões do formulário

    //Enviando valores do formulário
    onSubmit(){

        //Exportando os valores do formulário para o JSON
        this.formEl.addEventListener("submit", event => {

            event.preventDefault();
            let submitBtn = this.formEl.querySelector("[type=submit]")

            let values=this.getValuesFromForm();

            if(values !== false){

                submitBtn.disabled=true

            }
            
            this.getPhoto().then(
                (content)=>{

                    values.photo=content;
                    this.addLine(values);

                    this.formEl.reset();
                    submitBtn.disabled=false;

                },
                (e)=>{

                    console.error(e)

                });
          
          });
          
    }
    //Cancelando edição do usuário
    onCancel(){

        document.querySelector("#box-user-update .btn-cancel").addEventListener("click", e=>{
            this.showPanelCreate();
        });

    }

    //Display do projeto

    addLine(dataUser){

        let tr = document.createElement('tr');

        tr.dataset.user = JSON.stringify(dataUser);

        tr.innerHTML = ` 
            <td><img src="${dataUser.photo}" alt="User Image" class="img-circle img-sm"></td>
            <td>${dataUser.name}</td>
            <td>${dataUser.email}</td>
            <td>${(dataUser.admin) ? "Sim" : "Não"}</td>
            <td>${Utils.dateFormat(dataUser.register)}</td>
            <td>
                <button type="button" class="btn btn-primary btn-edit btn-xs btn-flat">Editar</button>
                <button type="button" class="btn btn-danger btn-xs btn-flat">Excluir</button>
            </td>
        `;

       tr.querySelector(".btn-edit").addEventListener("click", e=>{

            JSON.parse(tr.dataset.user)
            this.showPanelUpdate();

       }),

       this.tableEl.appendChild(tr);

       this.updateCount();

   }

   showPanelCreate(){

        document.querySelector("#box-user-create").style.display="block";
        document.querySelector("#box-user-update").style.display="none";

   }
   showPanelUpdate(){

        document.querySelector("#box-user-create").style.display="none";
        document.querySelector("#box-user-update").style.display="block";

   }

   updateCount(){

        let numUsers = 0;
        let numAdmins = 0;

        [...this.tableEl.children].forEach(tr =>{

            numUsers++;
            
            let user = JSON.parse(tr.dataset.user);
            if(user._admin){
                numAdmins++;
            }

        })

        document.querySelector("#number-users").innerHTML = numUsers;
        document.querySelector("#number-admins").innerHTML = numAdmins;
   }

}