<script lang="ts">
import { reactive, PropType, defineProps, defineEmits, defineOptions, onMounted, computed, watch } from 'vue'
import { emitter } from './ValidateForm.vue'
export interface RuleProp {
  type:'required' | 'email' |'password'|'custom';
  message: string;
  validator?:()=>boolean
}
export type RulesProp = RuleProp[]
export type TagType = 'input' | 'textarea'
</script>

<script lang="ts" setup>
onMounted(() => {
  emitter.emit('form-item-created', validateInput)
})
const emailReg = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/
// const passReg = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/
const passReg = /^.*$/

// 禁用继承
defineOptions({
  inheritAttrs: false
})
// 定义接收的类型
const props = defineProps({
  rules: Array as PropType<RulesProp>,
  modelValue: String,
  tag: {
    type: String as PropType<TagType>,
    default: 'input'
  }
})
const emit = defineEmits(['update:modelValue'])
const inputRef = reactive({
  val: computed({
    get: () => props.modelValue || '',
    set: val => {
      emit('update:modelValue', val)
    }
  }),
  error: false,
  message: ''
})
// const updatedValue = (e:KeyboardEvent) => {
//   const targetValue = (e.target as HTMLInputElement).value
//   inputRef.val = targetValue
//   emit('update:modelValue', targetValue)
//   // console.log(targetValue)
// }
const validateInput = () => {
  if (props.rules) { // 如果有规则
    // console.log(props.rules)
    const allPassed = props.rules.every(rule => {
      let passed = true // 默认通过
      inputRef.message = rule.message // 提示消息
      // console.log(inputRef.message, inputRef.val)
      // 根本没收到密码验证
      // console.log('Validating:', rule.type, 'result:', passed) // 打印每条规则的验证结果
      switch (rule.type) {
      case 'required':
        passed = (inputRef.val.trim() !== '') // 验证输入是否非空
        break
      case 'email':
        passed = emailReg.test(inputRef.val) // 验证格式
        break
      case 'password':
        passed = passReg.test(inputRef.val)
        if (!passed) {
          inputRef.val = ''
        } // 验证密码格式
        break
      case 'custom':
        passed = rule.validator ? rule.validator() : true
        break
      default:
        break
      }
      return passed // 返回验证结果
    })
    inputRef.error = !allPassed // 是否有没有通过的规则
    // console.log(inputRef.error)
    return allPassed
  }
  return true
}
console.log(inputRef.val)

</script>

<template>
  <div class="validate-input-container pb-3">
    <input
     v-if="tag !== 'textarea'"
     class="form-control"
     :class="{'is-invalid':inputRef.error}"
      @blur="validateInput"
      v-model="inputRef.val"
      v-bind="$attrs"
      >
    <textarea
     v-else
     class="form-control"
     :class="{'is-invalid':inputRef.error}"
      @blur="validateInput"
      v-model="inputRef.val"
      v-bind="$attrs"
     ></textarea>
    <span v-if="inputRef.error" class="invalid-feedback">{{ inputRef.message }}</span>
  </div>
</template>
