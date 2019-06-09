import React, { Component } from "react";
import { Form, Field } from "simple-react-forms";
import "./App.css";
import "../node_modules/react-bootstrap-table/css/react-bootstrap-table.css";
import "../node_modules/react-bootstrap-table/dist/react-bootstrap-table-all.min.css";
import ReactTable from "react-table";
import "../node_modules/react-table/react-table.css";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import TextField from "@material-ui/core/TextField";

class App extends Component {
  currentRow: any = {};
  deleteRow: boolean = false;
  editRow: boolean = false;
  constructor() {
    super();
    this.state = { data: [], open: false, name: "", weapon: "" };
    fetch("http://localhost:3001/showall")
      .then(data => data.json())
      .then(data => {
        console.log(data);
        this.setState({ data: data });
      });
    this.handleChangeName = this.handleChangeName.bind(this);
    this.handleChangeWeapon = this.handleChangeWeapon.bind(this);
  }
  handleChangeName(event) {
    this.setState({ name: event.target.value });
  }
  handleChangeWeapon(event) {
    this.setState({ weapon: event.target.value });
  }

  handleClickOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  onClickHandler() {
    console.log(this.refs["simpleForm"].getFormValues());
    let obj = this.refs["simpleForm"].getFormValues();
    fetch("http://localhost:3001/insert", {
      method: "post",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(obj)
    });
  }

  getRowInfo = (state, rowInfo, column, instance) => {
    return {
      onClick: e => {
        if (column.id === "action") {
          console.log(rowInfo.row._original);
          console.log("It was in this column:", column.id);
          this.currentRow = rowInfo.row._original;
          let obj = JSON.stringify(this.currentRow);
          console.log("obj = " + obj);
          if (this.deleteRow === true) {
            console.log("condition true going to delete the row ");
            fetch("http://localhost:3001/delete", {
              method: "post",
              headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
              },
              body: obj
            });

            this.deleteRow = false;
          }
          if (this.editRow === true) {
            this.setState({ name: this.currentRow.avenger });
            this.setState({ weapon: this.currentRow.weapon });
            this.handleClickOpen();
            console.log("Enter into getRowInfo edit row");
            this.editRow = false;
          }
        }
      }
    };
  };
  updateEntry = () => {
    console.log("Row updated");
    console.log(this.currentRow);
    this.currentRow.avenger = this.state.name;
    this.currentRow.weapon = this.state.weapon;
    let obj = JSON.stringify(this.currentRow);
    fetch("http://localhost:3001/update", {
      method: "post",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: obj
    });
    console.log(this.currentRow);
  };
  EditEntry() {
    console.log("Edit the entry");
    this.editRow = true;
  }

  deleteEntry() {
    this.deleteRow = true;
    console.log("deleteEntry func  value of deleteRow : " + this.deleteRow);
  }

  render() {
    return (
      <div>
        <br />
        <br />
        <Form ref="simpleForm">
          <Field name="avenger" label="Enter your name" type="text" />
          <Field name="weapon" label="Your weapon" type="text" />
        </Form>
        <button className="submitBtn" onClick={this.onClickHandler.bind(this)}>
          Submit
        </button>
        <br />
        <br />
        <br />

        <ReactTable
          data={this.state.data}
          getTdProps={this.getRowInfo}
          columns={[
            {
              Header: "Avengers",
              columns: [
                { id: "id", Header: "ID", accessor: "_id" },
                {
                  id: "name",
                  Header: "Name",
                  accessor: "avenger"
                },
                {
                  id: "weapon",
                  Header: "Weapon",
                  accessor: "weapon"
                },
                {
                  id: "action",
                  Header: "Action",
                  accessor: "delete",
                  Cell: row => (
                    <div className="btn">
                      <button onClick={this.deleteEntry.bind(this)}>
                        Delete
                      </button>
                      <button
                        className="btn2"
                        onClick={this.EditEntry.bind(this)}
                      >
                        Edit
                      </button>
                    </div>
                  )
                }
              ]
            }
          ]}
          defaultPageSize={5}
          className="-striped -highlight"
        />
        <Dialog
          open={this.state.open}
          onClose={this.handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">{"Update Details"}</DialogTitle>
          <DialogContent>
            <form>
              {" "}
              <TextField
                id="standard-name"
                label="Name"
                value={this.state.name}
                onChange={this.handleChangeName}
                margin="normal"
              />
              <TextField
                margin="dense"
                id="weapon"
                label="Weapon"
                type="text"
                value={this.state.weapon}
                onChange={this.handleChangeWeapon}
                fullWidth
              />
            </form>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleClose} color="primary">
              Cancel
            </Button>
            <Button onClick={this.updateEntry} color="primary" autoFocus>
              Update
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

export default App;
