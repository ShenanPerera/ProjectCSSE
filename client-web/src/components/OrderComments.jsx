import { useState  , useEffect} from "react";
import { useNavigate } from "react-router-dom";

const OrderComments= ({order}) => {
//   const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  console.log(order);
  const { items } = order;
  const navigate = useNavigate();
  const [commentBody , setCommentBody] = useState(null);
  const [orderID , setOrderID] = useState(null);
  const [filteredComments, setFilteredComments] = useState([]);
  const [commentAdded , setCommentAdded] = useState(false);

  const handleState = async (orderId , newState) =>{
    // console.log(orderId,newState);
    const response =  await fetch(`/api/api/orders/state/${orderId}`,{
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: newState,
    });
    console.log(response)
    if(newState == "placed"){
       navigate(`/procurement`);
    }else{
      setOrderID(orderId);
      console.log(orderID);
      setShowForm(true);
    }
   
  }

  const handleNewComments = async () =>{
    console.log('add Comment');
    console.log(orderID);
    console.log(commentBody);

    const comment = {
      orderId :{"id": orderID},
      text : commentBody,
    }

    const response = await fetch('/api/api/comments',{
      method : 'POST',
      headers :{
        "Content-Type": "application/json"},
      body :  JSON.stringify(comment),  
    });

    if (response.ok){
      console.log('successful');
      setCommentAdded(true);
      // console.log(response);
      window.location.reload()
    }else{
      console.error("Error adding comment:", response.status, response.statusText);
      // window.location.reload()
    }
  }

  const fetchComments = async() =>{
      console.log(order.id);

      const response = await fetch('/api/api/comments',{
        method:'GET',
        headers: {
          "Content-Type": "application/json"
        }
      });

      if (response.ok){
        const allComments = await response.json();
        console.log(allComments);
        const commentsForOrder = allComments.filter(comment => comment.orderId.id === order.id);
          // const isMatch = 
          // comment.orderId.id === order.id;
          // console.log('comment' ,comment);
          // console.log('comment order.id',comment.orderId.id);
          // console.log('order.id' ,order.id);
          // if(!isMatch){
          //   console.log('Filtered out', comment);
          // }
          // return isMatch;
        // });
        console.log(commentsForOrder);
        setFilteredComments(commentsForOrder);
        console.log(filteredComments);
      }
  }
  
  useEffect(() => {
    fetchComments();
  }, [commentAdded]);
  

  return (
    <div>
      < div className="border-black border-2 mx-10 px-20 py-4 rounded-md">
        <div>
          <center>
            <h3 className="mb-8 text-xl font-bold">Order Details</h3>
          </center>
        </div>
        <div>
            <ul>
              <li>Site : {order.mainSite.name}</li>
              <li className="my-2">Site Manager : {order.mainSite.siteManager}</li>
              <li className="my-2">Address : {order.mainSite.address}</li>
              <li className="my-2">
                <b>Total amount : Rs.{order.total.toFixed(2)}</b>
              </li>
            </ul>
        </div>
        <div>
          <p className="my-4">
            <b>Items</b>
          </p>
        </div>
        <div className="bg-[#FFF0BB] px-3 py-3">
          <div>
            <table className="min-w-full text-left text-sm font-light">
              <thead className="border-b font-medium dark:border-neutral-500">
                <tr>
                  {/* <th>Item Code</th> */}
                  <th>Item Name</th>
                  <th>Quantity</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(items).map(([name , quantity]) => (
                  <tr key={name}>
                    <td className="whitespace-nowrap px-2 py-2">{name}</td>
                    <td className="whitespace-nowrap px-2 py-2">{quantity}</td>
                    {/* <td className="whitespace-nowrap px-2 py-2">{item.qty}</td> */}
                  </tr>
               ))} 
              </tbody>
            </table>
          </div>
        </div>
        <div>
          <p className="my-4">
            <b>Comments</b>
          </p>
        </div>
        <div>
          <p>
            {filteredComments.map((comment)=>(
              <ul>
                <li>{comment.text}</li>
              </ul>
            ))}
          </p>
        </div>
        <div className="mr-20">
          <div>
            <button 
              className="bg-[#1FDF00] text-black font-bold py-2 px-4 rounded-full mx-4 my-4" 
              onClick={() => handleState(order.id , 'placed')}>
              Approve
            </button>
            <button class="bg-[#FF3333] text-black font-bold py-2 px-4 rounded-full mx-4 my-4" 
             onClick= {() => handleState(order.id , 'declined')}
              >
                Decline
            </button>
        </div>
        </div>
        </div>
        {/* {loading && <LoadingScreen />}  */}
        {showForm && (
        <div
          id="defaultModal"
          tabIndex="-1"
          aria-hidden="true"
          className="fixed inset-0 z-10 w-screen overflow-y-auto bg-black bg-opacity-50 grid"
        >
          <div className="absolute p-4 w-9/12 max-w-2 h-full right-28 top-36">
            <div className="relative p-4 bg-gray-300 rounded-lg shadowsm:p-5 grid align-middle ">
              <div className="flex justify-between items-center pb-4 mb-4 rounded-t border-b sm:mb-5 dark:border-gray-600">
                <h3 className="text-lg font-semibold text-gray-900">
                  Add Comment
                </h3>
                <button
                  type="button"
                  className="text-white bg-gray-600 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center hover:bg-[#f4ca40] hover:text-white"
                  data-modal-toggle="defaultModal"
                  onClick={() => setShowForm(false)}
                >
                  <svg
                    aria-hidden="true"
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                  <span className="sr-only">Close modal</span>
                </button>
              </div>

              {/* <form > */}
                {/* onSubmit={handleSubmit}> */}
                <div className="grid gap-4 mb-4 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <label
                      htmlFor="description"
                      className="block mb-2 text-sm font-medium text-gray-900"
                    >
                      Add Comment
                    </label>
                    <textarea
                      id="description"
                      rows="4"
                      className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="Reason to decline.."
                      value={commentBody}
                      onChange={(e) => setCommentBody(e.target.value)}
                    ></textarea>
                  </div>
                </div>
                <button
                  type="submit"
                  className="text-black inline-flex items-center bg-[#f4ca40] hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center "
                  onClick={handleNewComments}
                >
                  <svg
                    className="mr-1 -ml-1 w-6 h-6"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                  Add new Comment
                </button>
              {/* </form> */}
            </div>
          </div>
        </div>
      )}
        </div>
    )
}

export default OrderComments;
