// import React from "react";
// import LuigiClient from "@kyma-project/luigi-client";
// import { FormSet, FormItem, FormInput, FormLabel, FormMessage, Icon, FormSelect } from "fundamental-react";
// import { Button, Modal } from "@kyma-project/react-components";
// import JSONEditorComponent from "./../../../Shared/JSONEditor";
// import { labelsSchema } from "./../../../Shared/labelSchema";

// export default class ApplicationUpdateModal extends React.Component {
//   constructor(props) {
//     super(props);

//     this.state = {
//       nameValid: true,
//       descriptionValid: true,
//       labelsValid: true,
//       labels: null,
//       labelsText: JSON.stringify(props.application.labels)
//     };

//     this.editorRef = React.createRef();

//     this.nameFieldChanged = this.nameFieldChanged.bind(this);
//     this.descriptionFieldChanged = this.descriptionFieldChanged.bind(this);
//     this.isReadyToSave = this.isReadyToSave.bind(this);
//     this.onChangeLabel = this.onChangeLabel.bind(this);
//   }

//   isReadyToSave() {
//     return this.state.nameValid && this.state.descriptionValid && this.state.labelsValid;
//   }

//   nameFieldChanged(e) {
//     console.log(e.target.value.trim());
//     this.setState({ nameValid: e.target.value.trim() !== "" });
//   }

//   descriptionFieldChanged(e) {
//     this.setState({ descriptionValid: e.target.value.trim() !== "" });
//   }

//   onChangeLabel(value) {
//     console.log(this.editorRef.current.getAnnotations().validate())
//     this.setState({labelsText: value})
//     // if (!jsonHandler.validate(value, false)) {
//     //   this.setState({labelsValid: true});
//     // }
//     // else {
//     //   this.setState({labelsValid: false});
//     // }
//   }

//   render() {
//     const modalOpeningComponent = (
//       <Button onClick={() => console.log(this.props)} option="light">
//         Edit
//       </Button>
//     );

//     const actions = (
//       <>
//         <Button type="light">Cancel</Button>
//         <Button type="emphasized" disabled={!this.isReadyToSave()}>
//           Save
//         </Button>
//       </>
//     );

//     const content = (
//       <FormSet>
//         <FormItem key="name">
//           <FormLabel htmlFor="name" required={true}>
//             Name
//           </FormLabel>
//           <FormInput
//             id="name"
//             type="text"
//             placeholder={"Name"}
//             defaultValue={this.props.application.name}
//             onChange={this.nameFieldChanged}
//           />
//         </FormItem>
//         <FormItem key="description">
//           <FormLabel htmlFor="description" required={true}>
//             Description
//           </FormLabel>
//           <FormInput
//             id="description"
//             type="text"
//             placeholder={"Description"}
//             defaultValue={this.props.application.description}
//             onChange={this.descriptionFieldChanged}
//           />
//         </FormItem>
//         <FormItem key="labels">
//           <FormLabel htmlFor="labels">Labels</FormLabel>
//           <JSONEditorComponent
//             ref={this.editorRef}
//             id="labels"
//             text={this.state.labelsText}
//             schema={labelsSchema}
//             onChangeText={this.onChangeLabel}
//           />
//         </FormItem>
//       </FormSet>
//     );

//     return (
//       <Modal
//         actions={actions}
//         width={"480px"}
//         title="Edit Application"
//         modalOpeningComponent={modalOpeningComponent}
//         onShow={() => LuigiClient.uxManager().addBackdrop()}
//         onHide={() => LuigiClient.uxManager().removeBackdrop()}
//       >
//         {content}
//       </Modal>
//     );
//   }
// }
