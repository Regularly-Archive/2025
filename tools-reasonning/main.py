from langchain_community.chat_models import ChatOpenAI
from tools import SearchTool, CalculatorTool, SumTool, AverageTool
from reasoning import StructuredReasoning
from dotenv import load_dotenv
import os, json, time

def main():
    load_dotenv()

    llm = ChatOpenAI(
        model=os.getenv('MODEL_NAME'),
        temperature=0, 
        api_key=os.getenv('API_KEY'),
        base_url=os.getenv('BASE_URL')
    )
    
    tools = [SearchTool(), CalculatorTool(), SumTool(), AverageTool()]
    reasoning_engine = StructuredReasoning(llm, tools, max_steps=10)

    questions = [
        # "如果我有100元，要分3次投资，每次投资多少？假设每次投资受益为1%，最终受益是多少？",
        # "计算1到100之间的所有带5的数的和，所有带1的数的和",
        # "假设你有10块钱，需要分给弟弟、妹妹，要求你最少，弟弟次之，妹妹最多，最少不能能超过1块钱，最多不能超过5块，你会怎么分",
        # "许昕的公司为什么叫做上海许昕背后击球体育文化发展有限公司",
        "下列选项中，找出与众不同的一个：1.铝 2.锡 3.钢 4.铁 5.铜",
        "桌子上有4个苹果，小红吃了1个，小刚拿走了2个，还剩下几个苹果？",
        "There is a cat and a chicken in the box. How many feet do these two animals have?"
    ]

    for question in questions:
        print(f'question: {question}')

        reasoning_engine.reset()
        steps, final_answer = reasoning_engine.reason_and_act(question)
        
        reasonings = list(map(lambda x:f'{x.step_id}: {x.reasoning}', steps))
        thinkings = '<think>' + '\r\n'.join(reasonings) + '</think>'
        print(thinkings)

        print(final_answer)

if __name__ == "__main__":
    main()