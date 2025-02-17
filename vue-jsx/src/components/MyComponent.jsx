import { defineComponent, ref, onMounted, onBeforeUnmount } from 'vue';

const MyComponent = defineComponent({
  setup() {
    const count = ref(0);
    const title = 'Hello Vue 3 with JSX!';

    const increment = () => {
      count.value++;
    };

    onMounted(() => {
      console.log('Component mounted');
    });

    onBeforeUnmount(() => {
      console.log('Component will be destroyed');
    });

    return () => (
      <div>
        <h1>{title}</h1>
        <button onClick={increment}>Increment</button>
        <p>Count: {count.value}</p>
      </div>
    );
  },
});

export default MyComponent;