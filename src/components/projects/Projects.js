import React, { Component } from 'react';
import { connect } from 'react-redux';
import ProjectLineCard from './ProjectLineCard.js'
import { Container } from 'react-grid-system';
import { createProject, createDevice, getProjects, updateProjectDevices, 
  getDevices, getGateways} from "../../actions/actions.js";
import DOM from 'react-dom-factories';
import { Link } from 'react-router';
import ProjectForm from './ProjectForm.js';
import Button from '@material-ui/core/Button';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import projectImage from '../../images/project.png';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

class Projects extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalAddProject: false,
    };
  }
  
  componentDidMount() {
    this.props.getDevices({ limit: 1000 });
    this.props.getGateways();
    this.props.getProjects({ full: true });
  }

  render() {
    return (
      <Container fluid={true} style={{paddingBottom: '100px'}}>
        <AppBar position="static" style={{marginBottom: '30px',background: '#e9edf2'}}>
          <Toolbar>
          <img src={projectImage} height="50"/>
            <Typography variant="h5" className="page-title">
              Projects       
            </Typography>
          </Toolbar>
        </AppBar>
        <ProjectForm
          user={this.props.user}
          devices={this.props.devices}
          gateways={this.props.gateways}
          handleClose={() => this.setState({ modalAddProject: false })}
          modalOpen={this.state.modalAddProject}
          createDevice={this.props.createDevice}
          onSubmit={s => this.props.createProject(s)}
        />
        <Button variant="contained" color="primary" className="addProjectButton" onTouchTap={() => this.setState({ modalAddProject: true })} >Create a project</Button>
        <br />
        <br />
        {
          this.props.projects.length != 0 ? DOM.div(null, 
            this.props.projects.map((p,index) => 
            React.createElement(Link, { to: "/projects/" + p.id, key: { index } },
            React.createElement(ProjectLineCard, {project: p, updateProjectDevices: this.props.updateProjectDevices, permissions: this.props.permissions, key: (index)}))
        )) : 
        <div>
        <Paper style={{'padding':'20px'}}>
          <Typography variant="h5" component="h3">
          You don't have any projet.
          </Typography>
          <Typography component="p">
            Get started by creating your own IoT project.
          </Typography>
        </Paper>
      </div>
        }
      </Container>
    );
  }
}

function mapStateToProps(state) {
  return {
    projects: state.projects.projects,
    permissions: state.permissions.project,
    devices: state.devices.devices,
    gateways: state.gateways.gateways,
    user: state.current_user,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    createProject: (project) => {
      dispatch(createProject(project));
    },
    createDevice: (device) => {
      dispatch(createDevice(device));
    },
    getProjects: (params) => {dispatch(getProjects(params)) },
    updateProjectDevices: (sid, gid) => {dispatch(updateProjectDevices(sid, gid)) },
    getDevices: (params) => {
      dispatch(getDevices(params));
    },
    getGateways: (params) => {
      dispatch(getGateways(params));
    }
  };
}
export default connect(mapStateToProps, mapDispatchToProps)(Projects);