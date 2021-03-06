import React,{Component} from 'react';
import { Breadcrumb, BreadcrumbItem } from 'reactstrap';
import { Link } from 'react-router-dom';
import { Card, CardImg, CardTitle,CardBody,CardText,Button,Modal,
        ModalBody,ModalHeader,Col,Row} from 'reactstrap';
import { Control, LocalForm, Errors } from 'react-redux-form';
import {Loading } from './LoadingComponent';
import { baseUrl } from '../shared/baseUrl';


const required = val => val && val.length;
const maxLength = len =>val => !val || (val.length<= len);
const minLength=len =>val=>val && (val.length>=len);

class CommentForm extends Component{
    constructor(props){
        super(props);
        this.state={
            isModalOpen:false
        };
        this.toggleModal=this.toggleModal.bind(this);
    }
    handleSubmit(values){
        this.toggleModal();
        this.props.postComment(this.props.campsiteId, values.rating, values.author,values.text);
    }
    toggleModal(){ 
        this.setState({
            isModalOpen:!this.state.isModalOpen
        });
    }
    render(){
        
    
        return(
            <React.Fragment>
                <Button outline="fa-lg" onClick={this.toggleModal} >
                    <i className="fa fa-pencil"/>
                    Submit Comment
                </Button>
                <Modal isOpen={this.state.isModalOpen} toggle={this.toggleModal}>
                    <ModalHeader toggle={this.toggleModal}>Submit Comment</ModalHeader>
                    <ModalBody>
                        <LocalForm onSubmit={values => this.handleSubmit(values)}>
                            <Row className="form-group">
                                <Col className="col-md-3">
                                    Rating
                                </Col>
                            </Row>
                            <Row className="form-group">
                                <Col>
                                    <Control.select model=".rating" name="rating"
                                    id="rating" placeholder="1" className="form-control"
                                   >
                                        <option>1</option>
                                        <option>2</option>
                                        <option>3</option>
                                        <option>4</option>
                                        <option>5</option>
                                    </Control.select>
                                </Col>
                            </Row>
                            <Row className="form-group">
                                <Col className="col-md-3">
                                    Your Name
                                </Col>
                            </Row>
                            <Row className="form-group">
                                <Col>
                                    <Control.text model=".author"
                                    id="author" name="author" placeholder="Your Name"
                                    className="form-control"  validators={{
                                        required,
                                        minLength: minLength(2),
                                        maxLength: maxLength(15)
                                    }}/>
                                    <Errors
                                    className="text-danger"
                                    model=".author"
                                    show="touched"
                                    component="div"
                                    messages={{
                                        required: 'Required',
                                        minLength: 'Must be at least 2 characters',
                                        maxLength: 'Must be 15 characters or less'
                                    }}/>
                                </Col>
                            </Row>
                            <Row className="form-group">
                                <Col className="col-md-3">
                                   Comment
                                </Col>
                            </Row>
                            <Row className="form-group">
                                <Col>
                                    <Control.textarea model=".text"
                                    id="text" name="text" className="form-control" rows="6"/>
                                </Col>
                            </Row>
                            <Button type="submit" color="primary" >Submit</Button>
                        </LocalForm>
                        
                        
                    </ModalBody>
                </Modal>
            </React.Fragment>
            
        )
    }
}
function RenderComments({comments, postComment, campsiteId}){
        if(comments){
            return(
                <div className="col-md-5 m-1">
                    <h4>Comments</h4>
                    {comments.map((comment)  => {
                        return(
                            <div key={comment.id}>
                                <p>{comment.text}
                                {comment.author},{new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'short', day: '2-digit'}).format(new Date(Date.parse(comment.date)))}
                                </p>
                            </div>
                            );
                        }
                   
                    )}
                 <CommentForm campsiteId={campsiteId} postComment={postComment} />
                </div>
            );
            } 
            return <div/>
        }
    
function RenderCampsite({campsite}){
        return(
            <div className="col-md-5 m-1">
                <Card>
                    <CardImg top src={baseUrl + campsite.image} alt={campsite.name} />
                    <CardBody>
                        <CardTitle>{campsite.name}</CardTitle>
                        <CardText>{campsite.description}</CardText>
                    </CardBody>
                </Card>
            </div>
        );
    };
function CampsiteInfo(props){
            if(props.isLoading){
                return(
                    <div className="container">
                        <div className="row">
                            <Loading />
                        </div>
                    </div>
                )
            }
            if(props.errMess){
                return(
                    <div className="container">
                        <div className="row">
                            <div className="col">
                                <h4>{props.errMess}</h4>
                            </div>
                        </div>
                    </div>
                );
            }
            if(props.campsite){
                return(
                    <div className="container">
                    <div className="row">
                        <div className="col">
                            <Breadcrumb>
                                <BreadcrumbItem><Link to="/directory">Directory</Link></BreadcrumbItem>
                                <BreadcrumbItem active>{props.campsite.name}</BreadcrumbItem>
                            </Breadcrumb>
                            <h2>{props.campsite.name}</h2>
                            <hr />
                        </div>
                    </div>
                    <div className="row">
                        <RenderCampsite campsite={props.campsite} />
                        <RenderComments 
                            comments={props.comments}
                            postComment={props.postComment}
                            campsiteId={props.campsite.id} />
                    </div>
                </div>
                )
            }else{ 
                return( 
                <div></div>
            );
        }
    }


export default CampsiteInfo;