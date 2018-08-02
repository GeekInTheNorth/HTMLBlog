# Selecting Parent and Children in LINQ to Entities

Published: Jul 24, 2014

Recently I wanted to select one or more parent records along with the collection of child records as a property of the parent record using Linq to Entities.  I started out writing something like this:

```C#
var items = (from item in Context.Items
             join itemParameters in Context.ItemParameters 
             on item.ID equals itemParameters.ItemId
             select new
                 {
                     item.ItemType,
                     item.CreatedBy,
                     item.ItemCreatedDate,
                     itemParameters
                 }).ToList();
```

This came with it's own problem in that it returned a parent for each child on a one to one relationship and what I wanted was a one to many parent to child relationship. After a lot of unhappy googling I did find the following solution:

```C#
var items = (from item in Context.Items
             select new
                 {
                     item.ItemType,
                     item.CreatedBy,
                     item.ItemCreatedDate,
                     Parameters = (from itemParams in Context.ItemParameters
                                   where itemParams.BackgroundTaskID == item.ID
                                   select itemParams)
                 }).ToList();
```

A couple of notes regarding this ... I needed to translate the returned data into an object model which had enumerations as properties, when doing this I encountered a couple of issues. Using a Linq select operator on the anonymous object's child collection failed at run time, though it does compile. The same applies to using a ToList() statement on the sub-select in the initial Linq query.