import dayjs from 'dayjs';
import { shallowMount } from '@vue/test-utils';
import DatePickerCustomInput from '@/components/DatePicker/DatePickerCustomInput.vue';

jest.useFakeTimers();

describe('DatePickerCustomInput', () => {
  let mountComponent;
  const dummyDate = dayjs(new Date([2019, 5, 16]));

  beforeEach(() => {
    mountComponent = ({ props = {} } = {}) =>
      shallowMount(DatePickerCustomInput, {
        propsData: props,
      });
  });

  afterEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
    document.body.innerHTML = '';
  });

  it('Should init data', () => {
    const wrapper = mountComponent({ props: { date: dummyDate, name: 'datepicker', color: 'color' } });
    expect(wrapper.isVueInstance()).toBeTruthy();
    expect(wrapper.vm.name).toEqual('datepicker');
    expect(wrapper.vm.date).toEqual(dummyDate);
    expect(wrapper.vm.color).toEqual('color');
    expect(wrapper.vm.disabled).toEqual(false);
  });

  describe('computed', () => {
    describe('computedColor', () => {
      [{
        description: 'return disabled color if there is no color',
        props: {},
        expectedResult: 'rgba(93, 106, 137, 0.5)',
      }, {
        description: 'return disabled color if date isnt defined',
        props: { color: '#ffffff' },
        expectedResult: 'rgba(93, 106, 137, 0.5)',
      }, {
        description: 'return color if date is defined',
        props: { color: '#ffffff', isDateDefined: true },
        expectedResult: '#ffffff',
      }, {
        description: 'return disabled color if disabled',
        props: { color: '#ffffff', disabled: true },
        expectedResult: 'rgba(93, 106, 137, 0.5)',
      }].forEach(({ description, props, expectedResult }) => {
        it(`should ${description}`, () => {
          const wrapper = mountComponent({ props });
          expect(wrapper.vm.computedColor).toEqual(expectedResult);
        });
      });
    });
  });

  describe('behaviour', () => {
    it('should emit focus when input has been focused', () => {
      const wrapper = mountComponent({ props: { date: dummyDate } });
      const input = wrapper.find('input').element;
      input.focus();

      expect(wrapper.emitted().focus).toBeTruthy();
    });

    it('should emit blur event when click outside', () => {
      const wrapper = mountComponent();
      jest.runOnlyPendingTimers(); // timeout when init click-outside directive

      const button = document.createElement('button');
      button.addEventListener('click', jest.fn());
      document.body.appendChild(button);

      // Should close menu when on a button outisde
      button.click();
      jest.runOnlyPendingTimers();

      expect(wrapper.emitted().blur).toBeTruthy();
    });

    it('should emit keydown', () => {
      const wrapper = mountComponent({ props: { date: dummyDate } });
      const input = wrapper.find('input');
      input.trigger('keydown.esc');

      expect(wrapper.emitted().keydown).toBeTruthy();
    });

    describe('genButton', () => {
      it('should generate a button instead of an input with placeholder inside', () => {
        const wrapper = mountComponent({
          props: {
            date: dummyDate,
            isDateDefined: false,
            noInput: true,
            placeholder: 'YYYY-MM-DD',
          },
        });
        const button = wrapper.find('button').element;

        expect(button).toBeDefined();
        expect(button.innerHTML).toEqual('YYYY-MM-DD');
      });

      it('should generate a button instead of an input with date inside', () => {
        const wrapper = mountComponent({
          props: {
            date: dummyDate,
            isDateDefined: true,
            noInput: true,
            placeholder: 'YYYY-MM-DD',
          },
        });
        const button = wrapper.find('button').element;

        expect(button).toBeDefined();
        expect(button.innerHTML).not.toEqual('YYYY-MM-DD');

        wrapper.find('button').trigger('click');
        expect(wrapper.emitted().focus).toBeTruthy();
      });
    });

    describe('onFocus', () => {
      it('should do nothing if $refs.input not defined', () => {
        const wrapper = mountComponent();
        wrapper.vm.$refs = {};
        wrapper.vm.onFocus();
        expect(wrapper.emitted().focus).toBeFalsy();
      });

      it('should emit a focus event', () => {
        const wrapper = mountComponent();
        wrapper.vm.onFocus();
        expect(wrapper.emitted().focus).toBeTruthy();
      });
    });
  });
});
