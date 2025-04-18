import os
import json

def generate_files_object(root_dir):
    """
    递归生成符合 WebContainers 要求的文件结构对象
    :param root_dir: 项目根目录路径
    :return: 符合 WebContainers 格式的字典
    """
    files = {}
    
    for entry in os.listdir(root_dir):
        # 跳过隐藏文件和常见不需要的目录
        if entry.startswith('.') or entry in ['node_modules', '__pycache__']:
            continue
            
        full_path = os.path.join(root_dir, entry)
        
        # 处理目录
        if os.path.isdir(full_path):
            files[entry] = {
                'directory': generate_files_object(full_path)
            }
            
        # 处理文件
        else:
            try:
                with open(full_path, 'r', encoding='utf-8') as f:
                    contents = f.read()
                    
                    # 转义反引号保持格式兼容
                    escaped_contents = contents.replace('`', '\\`')
                    
                    files[entry] = {
                        'file': {
                            'contents': f'`{escaped_contents}`'
                        }
                    }
                    
            except UnicodeDecodeError:
                print(f"Skipping binary file: {full_path}")
                continue
                
    return files

if __name__ == '__main__':
    import sys
    
    if len(sys.argv) != 2:
        print("Usage: python converter.py <project_directory>")
        sys.exit(1)
        
    project_dir = sys.argv[1]
    
    if not os.path.exists(project_dir):
        print(f"Error: Directory {project_dir} does not exist")
        sys.exit(1)
        
    result = {
        'files': generate_files_object(project_dir)
    }
    
    # 生成可直接用于 JavaScript 的格式
    print("const files = " + json.dumps(
        result,
        indent=2,
        ensure_ascii=False
    ).replace('`"', '`').replace('"`', '`'))