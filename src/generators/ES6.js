import Common from './common';
const ES6Generator = {
  children: [], //holds fragments
  outputCode: "",//holds the output code


  //contants
  CLASS_START: "export class Foo {<br>", //+
  // Common.indentation + "contructor() {<br>",
  /**
   * this is used recursively to generate the ES6 code
   * @param model
   * @param isForChild
   */
  generatePart: function (model, isForChild, classname = "Foo") {
    let part = isForChild ? `export class  ${classname}{<br>` : "";
    //used to stub out the constructor
    let constructorPartParm1 = "object";//used in the constructor
    let constructorPart = `${Common.indentation}constructor (${constructorPartParm1}) {<br>`

    for (var prop in model) {
      if (model.hasOwnProperty(prop)) {
        if (typeof (model[prop]) === 'object') { //send this off to a fragment
          this.generatePart(model[prop], true, prop); //this will generate code that would  go in a separate typescript class
          constructorPart += `${Common.indentationX2}this.${prop} = new ${prop}(${constructorPartParm1}.${prop}); <br>`;
        }
        else {
          constructorPart += `${Common.indentationX2}this.${prop} = ${constructorPartParm1}.${prop}; <br>`;
        }
      }
    }

    constructorPart += `${Common.indentation}} <br>`;
    //remove last comma
    part += constructorPart + '}<br>';


    if (isForChild) {
      this.children.push(part);
    } else {
      this.outputCode += part;
    }
  },

  generate: function (model) {
    //reset the state
    this.outputCode = this.CLASS_START;
    this.children = [];

    this.generatePart(model, false);
    // add model fragments
    this.children.forEach(item => {
      this.outputCode += item;
    });
    return this.outputCode;
  }
};

export default ES6Generator;
