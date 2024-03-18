import useAsync from "hooks/useAsync";
import Multiselect from "multiselect-react-dropdown";
import Tree from "rc-tree";
import CategoryServices from "services/CategoryServices";
import { notifySuccess } from "utils/toast";
import { showingTranslateValue } from "utils/translate";

const ParentCategory = ({
  selectedCategory,
  setSelectedCategory,
  setDefaultCategory,
  lang,
}) => {
  const { data, loading } = useAsync(CategoryServices?.getAllCategory);
  const { data: getAllCategories } = useAsync(CategoryServices.getAllCategories);
  

  const STYLE = `
  .rc-tree-child-tree {
    display: block;
  }
  .node-motion {
    transition: all .3s;
    overflow-y: hidden;
  }
`;

  const motion = {
    motionName: "node-motion",
    motionAppear: false,
    onAppearStart: (node) => {
      return { height: 0 };
    },
    onAppearActive: (node) => ({ height: node.scrollHeight }),
    onLeaveStart: (node) => ({ height: node.offsetHeight }),
    onLeaveActive: () => ({ height: 0 }),
  };

  const renderCategories = (categories) => {
    let myCategories = [];
    if(categories){
    for (let category of categories) {
     myCategories.push({
       title: category.name, 
        key: category.id,
        children:
          category.children?.length > 0 && renderCategories(category.children),
      });
    }
  }
      return myCategories;
  };

  const findObject = (obj, target) => {
    return obj?.id === target
      ? obj
      : obj?.children?.reduce(
          (acc, obj) => acc ?? findObject(obj, target),
          undefined
        );
    // if (obj._id === target) return obj;

    // for (let c of obj.children) {
    //   let x = findObject(target, c);
    //   console.log('c', c);
    //   if (x) return x;
    // }
  };
  const findObjectById = (data, targetId) => {
    for (const item of data) {
        if (item.id === targetId) {
            return item;
        }
        if (item.children) {
            const nestedResult = findObjectById(item.children, targetId);
            if (nestedResult) {
                return nestedResult;
            }
        }
    }
    return null;
};
  const handleSelect = (key) => {
    const obj = findObjectById(getAllCategories?.tree?.data, key);
   
    const result = findObject(obj, key);

    if (result !== undefined) {
      const getCategory = selectedCategory.filter(
        (value) => value.id === result.id
      );

      if (getCategory.length !== 0) {
        return notifySuccess("This category already selected!");
      }

      setSelectedCategory((pre) => [
        ...pre,
        {
          id: result?.id,
          name: result?.name,
        },
      ]);
      setDefaultCategory(() => [
        {
          id: result?._id,
          name: result?.name,
        },
      ]);
    }
  };

  const handleRemove = (v) => {
    setSelectedCategory(v);
  };

  return (
    <>
      <div className="mb-2">
        <Multiselect
          displayValue="name"
          groupBy="name"
          isObject={true}
          hidePlaceholder={true}
          onKeyPressFn={function noRefCheck() {}}
          onRemove={(v) => handleRemove(v)}
          onSearch={function noRefCheck() {}}
          onSelect={(v) => handleSelect(v)}
          // options={selectedCategory}
          selectedValues={selectedCategory}
          placeholder={"Select Category"}
        ></Multiselect>
      </div>

      {!loading && data !== undefined && (
        <div className="draggable-demo capitalize">
          <style dangerouslySetInnerHTML={{ __html: STYLE }} />
          <Tree
            expandAction="click"
            treeData={renderCategories(getAllCategories?.tree?.data)}
            // defaultCheckedKeys={id}
            onSelect={(v) => handleSelect(v[0])}
            motion={motion}
            animation="slide-up"
          />
        </div>
      )}
    </>
  );
};

export default ParentCategory;
