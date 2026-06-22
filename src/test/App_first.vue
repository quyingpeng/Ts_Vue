<!--
 * @Author: qyp
 * @Date: 2026-06-10 16:48:21
 * @LastEditors: qyp
 * @LastEditTime: 2026-06-11 20:36:48
 * @Description: 
-->
<script setup lang="ts">
import { ref, reactive, computed,watch, watchEffect} from "vue";
const user = reactive({
  name: "张三",
  age: 30,
  hobbies: ["看书", "跑步"],
});
const firstName = ref<string>("张");
const lastName = ref<string>("三");
const keyword =ref<string>('')
const countW = ref(0);


// 计算属性：依赖变了自动重新算
const fullName = computed(() => {
  return firstName.value + lastName.value;
});

// 计算属性也能写 get 和 set
const fullName2 = computed({
  get: () => firstName.value + lastName.value,
  set: (val: string) => {
    firstName.value = val[0];
    lastName.value = val.slice(1);
  },
});
const addAge = () => {
  user.age++; //直接改 不想要.value
};
const addHobby = () => {
  user.hobbies.push("摸🐮");
};

watch(firstName,(newValue,oldValue)=>{
  console.log(`姓从"${oldValue}"变成"${newValue}"`)
})
watch([firstName,lastName],([newFirstName,newLastName])=>{
  console.log(`新名新姓：${newLastName} ${newFirstName}`)
})

watch(firstName,(newValue,oldValue)=>{
  console.log(`姓从"${oldValue}"变成"${newValue}"`)
},{immediate:true})

watch(
  () => user.age,
  (newVal) => {
    console.log("年龄变了", newVal);
  }
);
watch(
  user,
  () => {
    console.log("用户信息任意字段变化");
  },
  { deep: true }
)
watchEffect(()=>{
  console.log(`姓名：${lastName.value} ${firstName.value} `　)
})
</script>

<template>
  <div>
    <p>姓名{{ user.name }}</p>
    <p>年龄{{ user.age }}</p>
    <button @click="addAge">年龄+1</button>

    <div>
      <input v-model="firstName" placeholder="姓" />
      <input v-model="lastName" placeholder="名" />
      <p>全名：{{ fullName }}</p>
    </div>

    <p>爱好{{ user.hobbies.join("、") }}</p>
    <button @click="addHobby">加个爱好</button>
  </div>
</template>

<style scoped></style>
