"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mitosis_1 = require("@builder.io/mitosis");
(0, mitosis_1.useMetadata)({ isAttachedToShadowDom: true });
function SmileReviews(props) {
    var state = (0, mitosis_1.useStore)({
        reviews: [],
        name: 'test',
        showReviewPrompt: false,
    });
    // TODO: allow async function here
    (0, mitosis_1.onMount)(function () {
        fetch("https://stamped.io/api/widget/reviews?storeUrl=builder-io.myshopify.com&apiKey=".concat(props.apiKey || 'pubkey-8bbDq7W6w4sB3OWeM1HUy2s47702hM', "&productId=").concat(props.productId || '2410511106127'))
            .then(function (res) { return res.json(); })
            .then(function (data) {
            state.reviews = data.data;
        });
    });
    return (<div data-user={state.name}>
      <button onClick={function () { return (state.showReviewPrompt = true); }}>Write a review</button>
      <mitosis_1.Show when={state.showReviewPrompt}>
        <input placeholder="Email"/>

        <input css={{ display: 'block' }} placeholder="Title"/>

        <textarea css={{ display: 'block' }} placeholder="How was your experience?"/>
        <button css={{ display: 'block' }} onClick={function () {
            state.showReviewPrompt = false;
        }}>
          Submit
        </button>
      </mitosis_1.Show>
      <mitosis_1.For each={state.reviews}>
        {function (review, index) { return (<div $name="Review" key={review.id} css={{
                margin: '10px',
                padding: '10px',
                background: 'white',
                display: 'flex',
                borderRadius: '5px',
                boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
            }}>
            <img css={{ height: '30px', width: '30px', marginRight: '10px' }} src={review.avatar}/>
            <div class={state.showReviewPrompt ? 'bg-primary' : 'bg-secondary'}>
              <div>N: {index}</div>
              <div>{review.author}</div>
              <div>{review.reviewMessage}</div>
            </div>
          </div>); }}
      </mitosis_1.For>
    </div>);
}
exports.default = SmileReviews;
