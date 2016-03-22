var React = require('react-native');
var {
 Component,
 AppRegistry,
 StyleSheet,
 Text,
 View,
 TouchableHighlight,
 TextInput,
 ListView
} = React;

var Firebase = require('firebase');

class devdacticFirebase extends Component {
 constructor(props) {
   super(props);
   var myFirebaseRef = new Firebase('https://reactnativetestapp.firebaseio.com/');
   this.itemsRef = myFirebaseRef.child('items');

   this.state = {
   newTodo: '',
   todoSource: new ListView.DataSource({rowHasChanged: (row1, row2) => row1 !== row2})
 };
 this.items = [];
}
componentDidMount() {
 // When a todo is added
 this.itemsRef.on('child_added', (dataSnapshot) => {
   this.items.push({id: dataSnapshot.key(), text: dataSnapshot.val()});
   this.setState({
     todoSource: this.state.todoSource.cloneWithRows(this.items)
   })
 });
 // When a todo is removed
 this.itemsRef.on('child_removed', (dataSnapshot) => {
     this.items = this.items.filter((x) => x.id !== dataSnapshot.key());
     this.setState({
       todoSource: this.state.todoSource.cloneWithRows(this.items)
     })
   });
 }
 addTodo() {
   if (this.state.newTodo !== '') {
     this.itemsRef.push({
       todo: this.state.newTodo
     });
     this.setState({
       newTodo : ''
     });
   }
 }
 removeTodo(rowData) {
       this.itemsRef.child(rowData.id).remove();
}
 render() {
 return (
   <View style={styles.appContainer}>
     <View style={styles.titleView}>
       <Text style={styles.titleText}>
         My Todos
       </Text>
     </View>
     <View style={styles.inputcontainer}>
       <TextInput style={styles.input} onChangeText={(text) => this.setState({newTodo: text})} value={this.state.newTodo} />
       <TouchableHighlight
         style={styles.button}
         onPress={() => this.addTodo()}
         underlayColor='rgb(219, 213, 213)'>
         <Text style={styles.btnText}>Add!</Text>
       </TouchableHighlight>
     </View>
     <ListView
       dataSource={this.state.todoSource}
       renderRow={this.renderRow.bind(this)} />
   </View>
 )
}
 renderRow(rowData) {
   return (
     <TouchableHighlight
       underlayColor='rgb(221, 221, 221)'
       onPress={() => this.removeTodo(rowData)}>
       <View>
         <View style={styles.row}>
           <Text style={styles.todoText}>{rowData.text.todo}</Text>
         </View>
         <View style={styles.separator} />
       </View>
     </TouchableHighlight>
   )
 }
}

var styles = StyleSheet.create({
 appContainer:{
   flex: 1
 },
 titleView:{
   backgroundColor: 'rgb(72, 175, 219)',
   paddingTop: 30,
   paddingBottom: 10,
   flexDirection: 'row'
 },
 titleText:{
   color: 'rgb(255, 255, 255)',
   textAlign: 'center',
   fontWeight: 'bold',
   flex: 1,
   fontSize: 20,
 },
 inputcontainer: {
   marginTop: 5,
   padding: 10,
   flexDirection: 'row'
 },
 button: {
   height: 36,
   flex: 2,
   flexDirection: 'row',
   backgroundColor: 'rgb(72, 175, 219)',
   justifyContent: 'center',
   color: 'rgb(255, 255, 255)',
   borderRadius: 4,
 },
 btnText: {
   fontSize: 18,
   color: 'rgb(255, 255, 255)',
   marginTop: 6,
 },
 input: {
   height: 36,
   padding: 4,
   marginRight: 5,
   flex: 4,
   fontSize: 18,
   borderWidth: 1,
   borderColor: 'rgb(72, 175, 219)',
   borderRadius: 4,
   color: 'rgb(72, 187, 236)'
 },
 row: {
   flexDirection: 'row',
   padding: 12,
   height: 44
 },
 separator: {
   height: 1,
   backgroundColor: 'rgb(204, 204, 204)',
 },
 todoText: {
   flex: 1,
 }
});

AppRegistry.registerComponent('devdacticFirebase', () => devdacticFirebase);
